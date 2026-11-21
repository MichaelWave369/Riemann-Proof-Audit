# Contributing evidence, not hype

Contributions are welcome if they help the community verify the **precise** published claim. Focus on reproducible artifacts and exact references.

1. Open an issue with a descriptive title, date, original source URL, and the exact theorem/module or archive file involved.
2. State what you actually ran (OS, Lean/Mathlib commit, toolchain version, command, memory requirements, log and SHA-256), rather than what you believe it establishes.
3. For statements, explicitly compare the published formal theorem against the ordinary mathematical definition and inspect assumptions, imports, namespace resolution, and `#print axioms`.
4. Mark source scans as *leads*, compilation as *compilation*, kernel checks as *kernel checks*, and mathematical peer review as *mathematical review*.
5. Do not upload third-party proprietary or unlicensed source archives, credentials, huge logs with private paths, or compiled artifacts from untrusted source.
6. Never report RH or GRH as proved based on a dashboard badge or passing CI.

## Evidence levels

- S0 — archive provenance / byte-identical hash match
- S1 — static source scan and theorem-statement comparison
- S2 — clean compilation under pinned toolchain, with logs
- S3 — explicit trusted axiom inventory of final theorems
- S4 — independently checked kernel replay and frozen statement equivalence
- S5 — expert mathematical reconstruction, public review, community acceptance

These are separate levels, not automatic promotions. A result from a lower level never implies a higher level succeeded.
