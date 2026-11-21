# Φ Riemann Observatory

**An independent, evidence-first research dashboard and static source audit toolkit for Levent Alpöge's November 2026 RH/GRH Lean proof claim.**

> **Research status: unverified.** This repository does **not** prove RH or GRH; a successful source scan, React build, Lean compile, or unreviewed kernel replay is not mathematical acceptance. No connection or endorsement from Alpöge or Anthropic is implied.

## Live dashboard

Once GitHub Pages is deployed: **https://michaelwave369.github.io/Riemann-Proof-Audit/**

The Vite/React frontend provides:

- Claim versus evidence distinctions and a staged verification ladder
- Interactive high-level theorem/dependency map (not a complete Lean import closure)
- Source-backed evidence ledger with filters, dates, and verification criteria
- Offline/local JSON audit report viewer: drag a report onto the dashboard or select it from disk; the browser does not upload it
- Copyable audit commands, provenance details, links, and a research methodology

## Run locally

Prerequisites: Node.js 22+ and npm.

```bash
npm install
npm run dev
npm run build
```

Vite is configured for the project-pages base path `/Riemann-Proof-Audit/`. The GitHub Pages workflow installs locked packages, builds `dist`, and deploys it on pushes to `main`.

**First deployment note:** In the repository's **Settings → Pages → Build and deployment**, choose **GitHub Actions** as the source if the workflow reports a Pages configuration error.

## Static audit tools

The original Python scripts from the evidence workbench live in `tools/`. They do **not** execute untrusted Lean code:

```bash
python tools/fetch_original.py --out lean.tar.gz
python tools/audit_lean.py lean.tar.gz --out audit-report.json
python -m unittest discover -s tools/tests -v
```

The downloader attempts 14 original archive parts, reconstructs the archive, and verifies its size and SHA-256 against a **publicly reported** digest. This digest is not our independently authenticated checksum. The scanner looks for review leads, counts declarations/imports, and produces a **static** report. It is heuristic, not a proof verification. See [tools/README.md](tools/README.md).

**Safety:** Running or compiling third-party Lean source should be done in an isolated, unprivileged environment. Do not run the submitted source on a system with secrets, broad GitHub tokens, or privileged access. The frontend parses user-selected JSON files locally and never uploads them.

## Evidence and primary sources

- [Alpöge's original announcement (PDF)](https://alpo.ge/remark.pdf)
- [Alpöge's archive parts](https://alpo.ge/lean.tar.gz.part01) (01 through 14; use the downloader)
- [Independent community verification project](https://github.com/Deicyde/riemann-hypothesis)
- [Verification notes](https://github.com/Deicyde/riemann-hypothesis/blob/main/verification/NOTES.md)
- [Community mirror](https://github.com/CocoSgt/riemann-hypothesis-lean)
- [Clay Mathematics Institute: Riemann Hypothesis](https://www.claymath.org/millennium-problems/riemann-hypothesis/)

All facts displayed on the site are dated/static snapshots, not real-time checks. Update `src/data.js` only after reviewing new evidence. The original Lean archive is not redistributed here; its licensing status has not been confirmed. Attribution does not imply endorsement.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Useful contributions include exact file/line evidence, statement-equivalence checks, reproducible build logs with pinned toolchains, trusted-kernel replay, and independently understandable lemma explanations.

## Scope / licenses

No license is granted for Alpöge's original Lean source, which is **not** included here. The status of independent third-party source licenses must be checked before redistribution. This repository is a research tool and project scaffold; its presence on GitHub does not imply the original claim has passed verification.
