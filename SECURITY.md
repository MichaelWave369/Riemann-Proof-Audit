# Security and trust boundary

The provided Python utilities use only the standard library and do not intentionally execute Lean source. They process large, untrusted user-supplied files and are **not** a substitute for a hardened sandbox. Static regex flags can have false positives and negatives.

- Do not execute the submitted Lean files or build scripts on production machines.
- Use isolated containers/VMs without network access, secrets, or privileged filesystem mounts for compilation and replay.
- Treat all external repositories, archive parts, reports, and contributor pull requests as untrusted.
- Verify exact archive bytes before working on claims about a particular release; a matching published hash alone doesn't validate mathematics.
- The React app reads selected JSON through the local browser File API. It has no backend or upload endpoint.
- GitHub Pages action uses built-in `pages` and `id-token` permissions, with read-only repository content access.
