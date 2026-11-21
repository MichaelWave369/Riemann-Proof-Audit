export const project = {
  asOf: '21 NOV 2026',
  announced: '20 Nov 2026',
  publishedArchiveSha: '9631b4f020199e580ba86178cb56c6e9b09f690c2369a80dc4334aa93f49c7fc',
  archiveByteSize: 239275554,
};

export const sources = [
  { id: 'author', label: 'Original announcement', domain: 'alpo.ge', type: 'PRIMARY', href: 'https://alpo.ge/remark.pdf', description: 'Alpöge’s four-page description of the claimed proof and AI collaboration.' },
  { id: 'archive', label: 'Original Lean archive · part 01', domain: 'alpo.ge', type: 'PRIMARY', href: 'https://alpo.ge/lean.tar.gz.part01', description: 'The first of 14 numbered source archive segments; downloader fetches all 14.' },
  { id: 'verification', label: 'Independent verification repo', domain: 'GitHub', type: 'COMMUNITY', href: 'https://github.com/Deicyde/riemann-hypothesis', description: 'Community reproduction effort and published technical notes.' },
  { id: 'notes', label: 'Verification notes', domain: 'GitHub', type: 'COMMUNITY', href: 'https://github.com/Deicyde/riemann-hypothesis/blob/main/verification/NOTES.md', description: 'Environment, obstacles, results, and remaining reproduction work.' },
  { id: 'mirror', label: 'Lean source community mirror', domain: 'GitHub', type: 'COMMUNITY', href: 'https://github.com/CocoSgt/riemann-hypothesis-lean', description: 'Mirrored source material for exploring the submission.' },
  { id: 'clay', label: 'Clay Mathematics Institute', domain: 'claymath.org', type: 'REFERENCE', href: 'https://www.claymath.org/millennium-problems/riemann-hypothesis/', description: 'Background on the open problem and award requirements.' },
];

// Annotated conceptual sequence. NOT a complete or certified dependency graph.
export const proofNodes = [
  {
    id: 'every', num: '01', kind: 'CLAIM ENGINE', title: 'everyCharacter',
    short: 'GRH-strength zero-free claim',
    module: 'UpperTheory.FinalTheorems',
    description: 'Reported general statement for Dirichlet L-functions in the target half-plane. This is the branch requiring serious statement-equivalence and kernel verification.',
    test: 'Locate the precise theorem declaration, inspect definitions and imported axioms, and reconstruct the mathematical argument beneath it.',
    source: 'https://github.com/Deicyde/riemann-hypothesis',
  },
  {
    id: 'allchi', num: '02', kind: 'BRIDGE', title: 'allChi',
    short: 'Packages the character statement',
    module: 'Supplements.Kernels.MainTheorems',
    description: 'Referenced by the RH reduction as the general zero-free theorem for characters.',
    test: 'Check that the imported theorem has the intended universal quantifiers and does not silently narrow its domain.',
    source: 'https://github.com/CocoSgt/riemann-hypothesis-lean',
  },
  {
    id: 'reduction', num: '03', kind: 'REDUCTION', title: 'Formalism.VW.rh_of_every',
    short: 'Derives the RH statement',
    module: 'Formalism.VW',
    description: 'Reported reduction from the broader character theorem to the Riemann Hypothesis.',
    test: 'Inspect statement equivalence between the formal zeta zeros and the conventional critical-strip definition.',
    source: 'https://github.com/CocoSgt/riemann-hypothesis-lean',
  },
  {
    id: 'rh', num: '04', kind: 'SUBMITTED CONCLUSION', title: 'riemannHypothesis',
    short: 'Top-level Lean theorem',
    module: 'Main',
    description: 'The submitted top-level theorem expresses a formal Riemann Hypothesis object; its validity depends on the full theorem graph and trusted Lean kernel.',
    test: 'Compare the statement against the standard RH and inspect `#print axioms riemannHypothesis` under a reproduced environment.',
    source: 'https://github.com/CocoSgt/riemann-hypothesis-lean',
  },
];

export const evidence = [
  { id: 'A1', stage: 'S0', title: 'Author announced RH + GRH proof', status: 'Documented claim', tag: 'claim', date: '20 NOV', detail: 'Public statement exists. An announcement is not a verified mathematical solution.', sourceId: 'author' },
  { id: 'A2', stage: 'S0', title: 'Fourteen-part Lean source archive', status: 'Public source', tag: 'source', date: '20 NOV', detail: 'Archive parts are publicly linked. The checksum is mirrored/reported; it has not been independently authenticated by this dashboard.', sourceId: 'archive' },
  { id: 'A3', stage: 'S1', title: 'Preliminary no-sorry static scan', status: 'Community reported', tag: 'reported', date: '21 NOV', detail: 'Independent community notes describe source scans. String search is not a parser and never certifies the final theorem.', sourceId: 'notes' },
  { id: 'A4', stage: 'S1', title: 'Top-level proof dependency trace', status: 'Research lead', tag: 'lead', date: '21 NOV', detail: 'Conceptual path through everyCharacter → allChi → rh_of_every → riemannHypothesis. Requires source-level, semantic confirmation.', sourceId: 'mirror' },
  { id: 'A5', stage: 'S2', title: 'Pinned full-source compilation', status: 'Not certified here', tag: 'pending', date: '—', detail: 'Requires reproducible environment and complete logs for the exact source SHA and toolchain. This site makes no such claim.', sourceId: 'notes' },
  { id: 'A6', stage: 'S3', title: 'Final theorem axiom inventory', status: 'Not certified here', tag: 'pending', date: '—', detail: 'A successful build alone does not demonstrate that the final theorem relies only on expected foundational axioms.', sourceId: 'verification' },
  { id: 'A7', stage: 'S4', title: 'Independent trusted-kernel replay', status: 'Not certified here', tag: 'pending', date: '—', detail: 'A separate checker should validate the same frozen theorem statement and source against reviewed Lean kernels.', sourceId: 'verification' },
  { id: 'A8', stage: 'S5', title: 'Mathematical community acceptance', status: 'Not established', tag: 'pending', date: '—', detail: 'Experts must reconstruct novel arguments and resolve open objections. The 167-year-old problem is not marked solved.', sourceId: 'clay' },
];

export const stages = [
  { level: 'S0', title: 'Source preserved', description: 'Archive identity, version, checksum, provenance.' },
  { level: 'S1', title: 'Static inspection', description: 'Imports, declarations, source flags, theorem statement.' },
  { level: 'S2', title: 'Reproducible build', description: 'Pinned versions, clean environment, complete logs.' },
  { level: 'S3', title: 'Axiom audit', description: 'Confirm foundational assumptions on final theorems.' },
  { level: 'S4', title: 'Independent kernel', description: 'Separate replay, precise statement equivalence.' },
  { level: 'S5', title: 'Mathematical review', description: 'Novel arguments independently understood and accepted.' },
];
