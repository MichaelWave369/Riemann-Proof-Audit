# Riemann Hypothesis Proof: Independent Evidence Workbench

**Status: investigation tooling, NOT a verification of RH or GRH.**

Created for examining the 2026-11-20 Levent Alpöge / Claude Lean source release.
It performs **static, read-only inspection** without running any Lean code.

## Primary evidence

- Original statement: https://alpo.ge/remark.pdf
- Original Lean archive: `https://alpo.ge/lean.tar.gz.part01` through `...part14`
- Community mirror: https://github.com/CocoSgt/riemann-hypothesis-lean
- Independent verifier/Comparator: https://github.com/Deicyde/riemann-hypothesis
- Their verification notes: https://github.com/Deicyde/riemann-hypothesis/blob/main/verification/NOTES.md

Archive hash **reported by the independent mirror** (not calculated by us):
`9631b4f020199e580ba86178cb56c6e9b09f690c2369a80dc4334aa93f49c7fc`

## Running (Windows PowerShell, Python 3.10+)

Unzip this toolkit. From its directory:

```powershell
# Get all 14 original pieces, join in order, and verify size/SHA-256.
# This downloads files but does NOT run any author-provided code.
python .\fetch_original.py --out .\lean.tar.gz

# Scan the verified archive without extraction
python .\audit_lean.py .\lean.tar.gz --out .\audit-report.json

# Option A: already cloned source tree
python .\audit_lean.py C:\path\to\riemann-hypothesis-lean --out .\audit-report.json

# Option B: original joined archive; script verifies the publicly reported hash
python .\audit_lean.py C:\path\to\lean.tar.gz --out .\audit-report.json

# Run lightweight self-tests with synthetic source, no source download needed
python -m unittest discover -s tests -v
```

The report includes counts; source text flags; approximate local import closure; key theorem declarations; excerpts from crucial modules; and unresolved-import leads. Source archive is read but **not extracted**, avoiding execution and path extraction risks.

## Source reconstruction (manual, optional)

Use the original author downloads, not a random repack. Download `part01` through `part14`, append in numeric order in binary mode, then verify the SHA256 above. Ensure **enough free storage** for 239 MB compressed and substantially more if extracting. The `audit_lean.py` script can read the joined compressed archive directly.

## Where to investigate first

The top level is extremely simple:

1. `Main.lean` theorem `riemannHypothesis` uses `rhOfAll`.
2. `Supplements/Kernels/MainTheorems.lean` defines `rhOfAll` from `Formalism.VW.rh_of_every allChi`.
3. `allChi` comes from `UpperTheory.FinalTheorems.everyCharacter`.
4. `Development/AutomorphicArithmetic/CharacterBoxes/MainConclusion.lean` assembles the full `everyCharacter` result.
5. `Development/AutomorphicArithmetic/CharacterBoxes/EveryCharacter.lean` states the zero-free property in the half-plane.

This is a **dependency map, not evidence that the imported lemmas hold**.

## Evidence grading

- **S0:** Source preserved, hash compared.
- **S1:** Static scan and theorem-name/statement inspection.
- **S2:** Clean compilation with pinned Lean/Mathlib; exact machine logs.
- **S3:** Main theorem `#print axioms` contains only expected foundational axioms.
- **S4:** Independent comparator/kernel replay using trustworthy toolchain and frozen challenge statements.
- **S5:** Mathematicians independently understand/review key novel steps and public peer scrutiny.

A check at one level does not imply success at a higher level. Never report RH as solved based only on this script.

## Practical warning

The independent verification repo reports a very large resource footprint and is already attempting kernel replay. For a machine with **32GB RAM**, start with this lightweight audit and a selective math/theorem review, rather than immediately attempting the 175,000-module full build. Treat unverified Lean source as untrusted executable code and use a hardened sandbox for any compilation.

## Legal and attribution

This toolkit contains no redistributed Lean source from the submission. The author's public archive was published without an explicit license in the copies reviewed. Credit Alpöge and collaborators and avoid relicensing the original source.
