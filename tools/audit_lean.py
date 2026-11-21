#!/usr/bin/env python3
"""Static evidence collector for Alpöge's claimed RH/GRH Lean source.

Does not execute Lean source or certify any mathematical theorem.
Supports a checked-out repository, src/ directory, or original tar.gz archive.
"""
import argparse
from collections import Counter, defaultdict
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import tarfile

# Expected hash: independently published by public verification mirrors;
# do not interpret it as a successful proof verification.
PUBLISHED_ARCHIVE_SHA256 = "9631b4f020199e580ba86178cb56c6e9b09f690c2369a80dc4334aa93f49c7fc"
ROOTS = ("Main", "Statements")
IMPORTANT = (
    "Main", "Statements", "Supplements.Kernels.MainTheorems",
    "Development.AutomorphicArithmetic.CharacterBoxes.MainConclusion",
    "Development.AutomorphicArithmetic.CharacterBoxes.EveryCharacter",
    "Formalism.GammaFactorNonvanishing.CritLine",
)
# Flags are leads to review. Several features are legal Lean code.
PATTERNS = {
    "unfinished_proof": re.compile(r"\b(?:sorry|admit)\b"),
    "declared_axiom": re.compile(r"\baxiom\b"),
    "native_decide": re.compile(r"\bnative_decide\b"),
    "unsafe_or_opaque": re.compile(r"\b(?:unsafe|opaque|implemented_by|extern)\b"),
    "kernel_or_metaprogramming_review": re.compile(r"\b(?:addDecl|skipKernelTC|run_tac|elab|macro|syntax)\b"),
    "runtime_evaluation_review": re.compile(r"#(?:eval|reduce|check)\b"),
}
IMPORT_RE = re.compile(r"^\s*import\s+(.+?)\s*$")
DECL_RE = re.compile(r"^\s*(?:(?:private|protected|noncomputable|partial|local)\s+)*(?:theorem|lemma|def|abbrev|structure|class|instance|inductive)\s+([^\s:({]+)")
MAX_HITS_PER_CATEGORY = 150
MAX_FILE_BYTES = 40 * 1024 * 1024


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(4 * 1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def entries_from_archive(path):
    with tarfile.open(path, "r|gz") as archive:
        for member in archive:
            if not member.isfile() or not member.name.endswith(".lean"):
                continue
            if member.size > MAX_FILE_BYTES:
                raise ValueError("Large member requires manual review: " + member.name)
            parts = PurePosixPath(member.name).parts
            if ".." in parts or member.name.startswith("/"):
                raise ValueError("Unsafe archive member: " + member.name)
            if "src" not in parts:
                continue
            sub = parts[parts.index("src") + 1:]
            if not sub:
                continue
            with archive.extractfile(member) as f:
                yield ".".join(PurePosixPath(*sub).with_suffix("").parts), f.read()


def entries_from_directory(root):
    root = root / "src" if (root / "src").is_dir() else root
    for path in root.rglob("*.lean"):
        if path.is_symlink():
            raise ValueError("Symlink requires manual review: " + str(path))
        if path.stat().st_size > MAX_FILE_BYTES:
            raise ValueError("Large file requires manual review: " + str(path))
        yield ".".join(path.relative_to(root).with_suffix("").parts), path.read_bytes()


def scan(entries, max_hits=MAX_HITS_PER_CATEGORY):
    dependencies = {}
    counts = Counter()
    matches = defaultdict(list)
    declarations = defaultdict(list)
    highlighted = {}
    total_bytes = 0
    for module, data in entries:
        if module in dependencies:
            raise ValueError("Duplicate Lean module: " + module)
        counts["lean_files"] += 1
        total_bytes += len(data)
        text = data.decode("utf-8", errors="replace")
        lines = text.splitlines()
        counts["lines"] += len(lines)
        imports = []
        for lineno, line in enumerate(lines, 1):
            im = IMPORT_RE.match(line)
            if im:
                imports.extend(im.group(1).split(" -- ")[0].split())
            dec = DECL_RE.match(line)
            if dec:
                counts["declarations"] += 1
                if module in IMPORTANT:
                    declarations[module].append({"line": lineno, "name": dec.group(1)})
            for category, regex in PATTERNS.items():
                if regex.search(line):
                    counts["flag_" + category] += 1
                    if len(matches[category]) < max_hits:
                        matches[category].append({"module": module, "line": lineno, "text": line[:240]})
        dependencies[module] = sorted(set(imports))
        if module in IMPORTANT:
            highlighted[module] = text[:10000]
    # Walk local import closure. Externally provided Mathlib modules are not in this graph.
    reached, pending = set(), ["Main"]
    while pending:
        m = pending.pop()
        if m in reached or m not in dependencies:
            continue
        reached.add(m)
        pending.extend(dep for dep in dependencies[m] if dep in dependencies and dep not in reached)
    missing_internal = []
    for mod, deps in dependencies.items():
        for dep in deps:
            if dep not in dependencies and not dep.startswith(("Mathlib", "Lean", "Batteries", "Std", "Aesop", "Qq", "Plausible", "ProofWidgets", "ImportGraph", "LeanSearchClient", "MathlibTest", "Lake")):
                if len(missing_internal) < 100:
                    missing_internal.append({"from": mod, "unresolved": dep})
    result = {
        "description": "STATIC ANALYSIS ONLY; NOT A PROOF VERIFICATION",
        "generated_utc": datetime.now(timezone.utc).isoformat(),
        "counts": {**dict(counts), "source_bytes": total_bytes,
                   "reachable_from_Main": len(reached),
                   "not_reachable_from_Main": len(set(dependencies) - reached)},
        "roots_present": {r: r in dependencies for r in ROOTS},
        "important_modules_present": {r: r in dependencies for r in IMPORTANT},
        "important_declarations": dict(declarations),
        "review_flags": dict(matches),
        "unresolved_imports_sample": missing_internal,
        "unreachable_from_Main_sample": sorted(set(dependencies) - reached)[:40],
        "important_source_excerpt": highlighted,
        "notes": [
            "Regex search is not a parser and can report false positives, including inside strings and comments.",
            "Absence of flags cannot rule out unsound metaprogramming, definition tampering, or bad theorem statements.",
            "Import reachability is approximate; Lean imports and library setup require semantic verification.",
            "Only trusted Lean kernel replay, axiom audit, dependency pin checking, and mathematical review can support a proof claim.",
        ],
    }
    return result


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("source", type=Path, help="Lean source checkout, src folder, or joined .tar.gz")
    ap.add_argument("--out", type=Path, default=Path("audit-report.json"))
    ap.add_argument("--expected-sha256", default=PUBLISHED_ARCHIVE_SHA256,
                    help="Expected SHA256 for .tar.gz; empty string disables comparison")
    args = ap.parse_args()
    if not args.source.exists():
        ap.error("Path does not exist: " + str(args.source))
    if args.source.is_file():
        digest = sha256(args.source)
        if args.expected_sha256 and digest.lower() != args.expected_sha256.lower():
            raise SystemExit("ARCHIVE HASH MISMATCH. Expected " + args.expected_sha256 + ", got " + digest)
        entries = entries_from_archive(args.source)
    else:
        digest = None
        entries = entries_from_directory(args.source)
    report = scan(entries)
    report["source"] = str(args.source)
    report["archive_sha256"] = digest
    args.out.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Written:", args.out)
    for key, value in report["counts"].items():
        print(f"  {key}: {value}")
    print("This is a static scan, NOT proof verification.")


if __name__ == "__main__":
    main()
