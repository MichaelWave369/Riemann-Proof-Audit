import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown,
  CircleAlert, Clipboard, CloudUpload, CodeXml, Download, ExternalLink, FileJson,
  FileSearch, Fingerprint, GitBranch, Github, Layers3, Menu, Microscope,
  Network, Radio, ScanSearch, ShieldCheck, X
} from 'lucide-react';
import { project, sources, proofNodes, evidence, stages } from './data.js';

const nav = [
  ['overview', 'Overview'],
  ['proof', 'Proof map'],
  ['ledger', 'Evidence ledger'],
  ['workbench', 'Audit workbench'],
  ['method', 'Methodology'],
];

function SourceLink({ id, children, className = '' }) {
  const item = sources.find(s => s.id === id);
  return <a className={className} href={item?.href} target="_blank" rel="noopener noreferrer">{children ?? item?.label} <ArrowUpRight size={13} aria-hidden="true" /></a>;
}

function SectionTitle({ kicker, title, description, action }) {
  return <div className="section-title">
    <div><div className="eyebrow"><span className="eyebrow-line" />{kicker}</div><h2>{title}</h2>{description && <p>{description}</p>}</div>
    {action}
  </div>;
}

function ClaimStatus({ tone = 'amber', children }) {
  return <span className={`status-pill ${tone}`}><span className="status-dot" />{children}</span>;
}

function LatexStripChart() {
  const dots = [26, 47, 71, 100, 127, 153, 176, 200];
  return <div className="math-card" aria-label="Illustration of the Riemann critical strip with example points on the real-part-one-half line">
    <div className="math-card-top"><span>THE CRITICAL STRIP</span><span>0 &lt; Re(s) &lt; 1</span></div>
    <svg viewBox="0 0 445 285" role="img" aria-label="Illustrative zeros along the real part one half line; not numerically scaled">
      <defs>
        <linearGradient id="stripFill" x1="0" x2="1"><stop offset="0%" stopColor="#55b7b6" stopOpacity=".025" /><stop offset="50%" stopColor="#55b7b6" stopOpacity=".09" /><stop offset="100%" stopColor="#55b7b6" stopOpacity=".025" /></linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect x="73" y="28" width="296" height="216" fill="url(#stripFill)" />
      {[73,147,221,295,369].map(x=><line key={x} x1={x} y1="28" x2={x} y2="244" stroke="#bcd1df" strokeOpacity={x===221?.3:.12} strokeDasharray="3 6" />)}
      {[28,82,136,190,244].map(y=><line key={y} x1="73" y1={y} x2="369" y2={y} stroke="#bcd1df" strokeOpacity=".12" strokeDasharray="3 6" />)}
      <line x1="221" y1="28" x2="221" y2="244" stroke="#53d8ba" strokeWidth="2" filter="url(#glow)" />
      {dots.map((d,i)=><g key={i}><circle cx="221" cy={39+d*.94} r="7" fill="#53d8ba" opacity=".13"/><circle cx="221" cy={39+d*.94} r="3.1" fill="#9bf5dc" /></g>)}
      <line x1="73" x2="369" y1="244" y2="244" stroke="#8da0ac" strokeWidth="1" />
      <text x="73" y="261" fill="#7e94a3" fontSize="12" textAnchor="middle">0</text>
      <text x="221" y="261" fill="#7fdec8" fontSize="12" textAnchor="middle">½</text>
      <text x="369" y="261" fill="#7e94a3" fontSize="12" textAnchor="middle">1</text>
      <text x="221" y="280" fill="#8097a8" fontSize="11" textAnchor="middle">REAL PART OF s</text>
      <text x="31" y="146" fill="#8097a8" fontSize="11" transform="rotate(-90 31 146)" textAnchor="middle">IMAGINARY PART</text>
      <text x="231" y="18" fill="#68e4ca" fontSize="11">Re(s) = ½</text>
    </svg>
    <div className="math-card-bottom"><span className="pulse-dot" /> RH predicts all nontrivial zeta zeros lie here</div>
    <p className="math-note">Illustration only. Positions are not to numerical scale.</p>
  </div>;
}

function Overview({ go }) {
  return <>
    <div className="hero-layout">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-line" />OPEN MATHEMATICS · OPEN EVIDENCE</div>
        <h1>An extraordinary claim deserves an <em>extraordinary audit.</em></h1>
        <p className="hero-desc">In November 2026, Levent Alpöge described a proposed Lean formalization of the Riemann and Generalized Riemann Hypotheses, developed with Claude. We follow the mathematics, preserve the evidence, and separate proof from proclamation.</p>
        <div className="hero-actions"><button className="primary-btn" onClick={() => go('proof')}>Explore the proof chain <ArrowRight size={17}/></button><button className="ghost-btn" onClick={() => go('workbench')}>Open audit tools <CodeXml size={17}/></button></div>
        <div className="hero-status"><ClaimStatus tone="amber">Independent verification pending</ClaimStatus><span>Evidence snapshot · {project.asOf}</span></div>
      </div>
      <LatexStripChart />
    </div>
    <div className="metrics-grid">
      {[
        {n:'167',unit:'YEARS',t:'An open mathematical question',small:'Dating to 1859'},
        {n:'14',unit:'PARTS',t:'Original source archive',small:'Published as split tar.gz'},
        {n:'~17.4M',unit:'LINES',t:'Reported Lean source scale',small:'Community-reported count'},
        {n:'0',unit:'CERTIFIED',t:'Proofs validated by this project',small:'No independent certification here'},
      ].map((m,i)=><div className="metric" key={i}><div className="metric-index">0{i+1} / 04</div><div className="metric-num">{m.n}<span>{m.unit}</span></div><div className="metric-title">{m.t}</div><div className="metric-small">{m.small}</div></div>)}
    </div>
    <div className="overview-bottom">
      <div className="glass-panel theory-panel"><div className="panel-top"><span className="mini-label">THE MATHEMATICAL HEART</span><BookOpen size={18}/></div><div className="theory-symbol">ζ(s) = 0 <span>⇒ ?</span> Re(s) = <b>½</b></div><p>The Riemann Hypothesis asserts that every nontrivial zero of the analytically continued zeta function lies on the critical line. GRH extends a corresponding statement to Dirichlet L-functions.</p><SourceLink id="clay" className="text-link">Understand the hypothesis</SourceLink></div>
      <div className="glass-panel priority-panel"><div className="panel-top"><span className="mini-label">NEXT PRIORITY</span><Fingerprint size={18}/></div><h3>Verify the statement, then the engine.</h3><p>A huge Lean proof is only as meaningful as the exact theorem it states, the axioms it relies on, and whether independent kernels can replay it.</p><button className="text-action" onClick={() => go('ledger')}>See the evidence ladder <ArrowRight size={16}/></button></div>
    </div>
  </>;
}

function ProofMap() {
  const [selected, setSelected] = useState(proofNodes[0].id);
  const active = proofNodes.find(n=>n.id===selected);
  return <section className="section-inner">
    <SectionTitle kicker="DEPENDENCY EXPLORER" title="Follow the claim to its core." description="An annotated high-level pathway through the published Lean source. This is a research aid, not a complete import graph or proof certificate." action={<ClaimStatus tone="gray">Conceptual trace</ClaimStatus>}/>
    <div className="map-layout">
      <div className="map-chain">
        {proofNodes.map((node,i)=><React.Fragment key={node.id}>
          <button onClick={()=>setSelected(node.id)} className={`map-node ${node.id===selected?'active':''}`} aria-pressed={node.id===selected}>
            <span className="node-num">{node.num}</span><span className="node-body"><span className="node-kind">{node.kind}</span><strong>{node.title}</strong><span className="node-sub">{node.short}</span></span><ArrowUpRight size={18} className="map-arrow"/>
          </button>
          {i<proofNodes.length-1&&<div className="chain-connector"><span/><ArrowDown size={17}/></div>}
        </React.Fragment>)}
      </div>
      <div className="node-detail glass-panel"><div className="detail-top"><span className="mini-label">SELECTED DEPENDENCY</span><span className="detail-index">{active.num} / 04</span></div><h3>{active.title}</h3><div className="module-name"><CodeXml size={16}/>{active.module}</div><p>{active.description}</p><div className="detail-callout"><div className="mini-label">NEXT VERIFICATION TEST</div><p>{active.test}</p></div><a className="text-link" href={active.source} target="_blank" rel="noopener noreferrer">Explore source references <ArrowUpRight size={15}/></a><div className="detail-disclaimer"><CircleAlert size={16}/><span>Module names and relationships must be checked against the exact archived source before publication as formal dependencies.</span></div></div>
    </div>
    <div className="research-question"><div className="research-icon"><Microscope size={22}/></div><div><span className="mini-label">THE RESEARCH QUESTION</span><h3>Where does the new mathematics actually happen?</h3><p>Start inside <code>UpperTheory.FinalTheorems.everyCharacter</code> and trace its imported proof obligations. Inspect both what the theorem says and how its most novel underlying lemmas are justified.</p></div></div>
  </section>;
}

function Ledger() {
  const [filter, setFilter] = useState('all');
  const filtered = filter==='all' ? evidence : evidence.filter(x=>filter==='pending'?x.tag==='pending':x.tag!=='pending');
  return <section className="section-inner">
    <SectionTitle kicker="EVIDENCE, NOT OPTIMISM" title="The evidence ledger." description="Every item has a provenance link and a carefully limited interpretation. No status here is a live computational validation." action={<div className="filter-set" role="group" aria-label="Filter evidence">
      {[['all','All'],['documented','Documented'],['pending','Open']].map(([k,t])=><button key={k} aria-pressed={filter===k} className={filter===k?'selected':''} onClick={()=>setFilter(k)}>{t}</button>)}
    </div>}/>
    <div className="ledger-table">
      <div className="ledger-header"><span>ID / STAGE</span><span>OBSERVATION</span><span>CLASSIFICATION</span><span>REFERENCE</span></div>
      {filtered.map(item=><div className="ledger-row" key={item.id}>
        <div className="ledger-code"><b>{item.id}</b><span>{item.stage}</span></div>
        <div className="ledger-description"><strong>{item.title}</strong><p>{item.detail}</p></div>
        <div><ClaimStatus tone={item.tag==='pending'?'gray':item.tag==='claim'?'amber':item.tag==='source'?'teal':'blue'}>{item.status}</ClaimStatus></div>
        <SourceLink id={item.sourceId} className="ledger-source">Source</SourceLink>
      </div>)}
    </div>
    <div className="ledger-footnote"><CircleAlert size={16}/><span>Unknown is not false, and public is not proven. The ledger describes available evidence as of {project.asOf}.</span></div>
  </section>;
}

const commandList = [
  {title:'01 / RECONSTRUCT', line:'python tools/fetch_original.py --out lean.tar.gz', detail:'Fetch all 14 original archive parts and compare bytes and published SHA-256.'},
  {title:'02 / STATIC INSPECTION', line:'python tools/audit_lean.py lean.tar.gz --out audit-report.json', detail:'Count Lean files, trace local imports, and locate review flags without running source.'},
  {title:'03 / SELF-TEST', line:'python -m unittest discover -s tools/tests -v', detail:'Run small synthetic unit tests for the audit utility itself.'},
];

function AuditWorkbench() {
  const [report, setReport] = useState(null);
  const [fileName,setFileName]=useState('');
  const [error,setError] = useState('');
  const [copied,setCopied] = useState('');
  const [dragging,setDragging] = useState(false);
  const inputRef=useRef(null);
  async function loadFile(file) {
    if(!file)return;
    setError('');
    if(file.size>25*1024*1024){setError('File is larger than the 25 MB local-viewer limit.');return;}
    try {
      const parsed=JSON.parse(await file.text());
      if(!parsed || typeof parsed!=='object' || Array.isArray(parsed) || !parsed.counts || typeof parsed.counts!=='object') throw new Error('Not a valid audit_lean.py JSON report.');
      setReport(parsed);setFileName(file.name);
    }catch(e){setError(`Cannot read report: ${e.message}`);}
  }
  async function copy(s){try{await navigator.clipboard.writeText(s);setCopied(s);}catch{setCopied('clipboard-unavailable');}}
  const reportFlags=useMemo(()=>report?Object.entries(report.counts||{}).filter(([k])=>k.startsWith('flag_')):[],[report]);
  return <section className="section-inner">
    <SectionTitle kicker="THE INDEPENDENT TOOLKIT" title="From source to observable evidence." description="A reproducible first pass that never compiles the submitted Lean code. Audit locally, then inspect the report in your browser." action={<ClaimStatus tone="teal">Read-only tooling</ClaimStatus>}/>
    <div className="workbench-grid">
      <div className="terminal-panel">
        <div className="terminal-heading"><div className="terminal-dots"><i/><i/><i/></div><span>audit pipeline / python</span><span>LOCAL</span></div>
        <div className="terminal-body">
          {commandList.map(cmd=><div className="command-group" key={cmd.title}><div className="command-heading">{cmd.title}</div><div className="command-line"><code><span>$</span> {cmd.line}</code><button onClick={()=>copy(cmd.line)} aria-label={`Copy ${cmd.title} command`} title="Copy command">{copied===cmd.line?<Check size={16}/>:<Clipboard size={16}/>}</button></div><p>{cmd.detail}</p></div>)}
          <div className="terminal-footer"><ShieldCheck size={16}/> These tools do not execute the proof source</div>
        </div>
      </div>
      <div className="report-panel glass-panel"><div className="panel-top"><span className="mini-label">LOCAL REPORT VIEWER</span><FileJson size={19}/></div><div className={`dropzone ${dragging?'dragging':''}`} onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={e=>{e.preventDefault();setDragging(false);}} onDrop={e=>{e.preventDefault();setDragging(false);loadFile(e.dataTransfer.files?.[0]);}}><CloudUpload size={31}/><h3>{report?'Report loaded':'Bring your own evidence'}</h3><p>{report?fileName:'Load the JSON created by audit_lean.py. Parsed locally; never uploaded to any server.'}</p><input ref={inputRef} type="file" accept=".json,application/json" className="visually-hidden" onChange={e=>loadFile(e.target.files?.[0])} /><button className="secondary-btn" onClick={()=>inputRef.current?.click()}>{report?'Replace report':'Select audit report'} <ArrowRight size={16}/></button></div>
        {error&&<div className="file-error" role="alert"><CircleAlert size={16}/>{error}</div>}
        {report?<div className="report-results"><div className="report-results-title"><Check size={17}/><strong>Local JSON parsed</strong><button onClick={()=>{setReport(null);setFileName('');if(inputRef.current)inputRef.current.value='';}} aria-label="Clear report"><X size={16}/></button></div><div className="report-grid"><div><b>{Number(report.counts?.lean_files||0).toLocaleString()}</b><span>LEAN FILES</span></div><div><b>{Number(report.counts?.lines||0).toLocaleString()}</b><span>LINES SCANNED</span></div><div><b>{Number(report.counts?.reachable_from_Main||0).toLocaleString()}</b><span>REACHABLE MODULES</span></div><div><b>{reportFlags.reduce((a,[,n])=>a+Number(n||0),0).toLocaleString()}</b><span>REGEX FLAGS*</span></div></div><div className="report-hash"><span>ARCHIVE SHA-256</span><code>{report.archive_sha256||'Not supplied (directory scan)'}</code></div><p className="report-warning">*Heuristic flags are review leads, including possible matches in comments or strings. Parsing a report does not verify any theorem.</p></div>:<div className="empty-report"><FileSearch size={17}/> No evidence report loaded yet</div>}
      </div>
    </div>
    <div className="hash-panel"><Fingerprint size={20}/><div><span className="mini-label">PUBLICLY REPORTED ARCHIVE SHA-256</span><code>{project.publishedArchiveSha}</code><p>Expected checksum from a community mirror. A match proves byte identity to that reported artifact, not proof correctness or author provenance.</p></div><button onClick={()=>copy(project.publishedArchiveSha)} title="Copy checksum" aria-label="Copy archive checksum">{copied===project.publishedArchiveSha?<Check size={18}/>:<Clipboard size={18}/>}</button></div>
  </section>;
}

function Methodology() {
  const [open, setOpen]=useState('S0');
  return <section className="section-inner">
    <SectionTitle kicker="SIX DISTINCT LEVELS" title="No shortcut from code to certainty." description="Evidence strengthens through independent reproduction, axiomatic inspection, and mathematical understanding. Completing one stage never guarantees another." />
    <div className="method-layout"><div className="method-list">{stages.map((s,i)=><div className={`method-item ${open===s.level?'open':''}`} key={s.level}><button onClick={()=>setOpen(open===s.level?'':s.level)} aria-expanded={open===s.level}><span>{s.level}</span><strong>{s.title}</strong><ChevronDown size={19}/></button>{open===s.level&&<p>{s.description}{i===0?' First establish exactly which release and artifact are being discussed.':''}</p>}</div>)}</div><div className="method-aside glass-panel"><span className="mini-label">THE NON-NEGOTIABLE DISTINCTION</span><div className="aside-big">Proof code <span>≠</span> accepted proof.</div><p>For a result this important, the full chain matters: the stated theorem, its assumptions, the software kernel, reproducibility, and independent mathematical scrutiny.</p><div className="method-rule"/><div className="mini-label">OUR RULE</div><blockquote>Every strong claim needs an equally strong trail of inspectable evidence.</blockquote><SourceLink id="clay" className="text-link">Millennium Prize context</SourceLink></div></div>
    <SectionTitle kicker="START WITH PRIMARY EVIDENCE" title="Sources & references." description="These links lead to the author's announcement, original source, community auditing work, and institutional background." />
    <div className="source-grid">{sources.map(src=><a key={src.id} className="source-card" href={src.href} target="_blank" rel="noopener noreferrer"><span className="source-type">{src.type} <ArrowUpRight size={15}/></span><strong>{src.label}</strong><p>{src.description}</p><span className="source-domain">{src.domain}</span></a>)}</div>
    <div className="independence">This project is independent, not affiliated with Levent Alpöge or Anthropic. No original Lean archive is redistributed, and the mathematical claim remains unverified here.</div>
  </section>;
}

export default function App() {
  const [tab,setTab] = useState('overview');
  const [mobileNav,setMobileNav] = useState(false);
  function go(target) {setTab(target);setMobileNav(false);window.scrollTo({top:0,behavior:'smooth'});}
  return <div className="app-shell">
    <div className="top-accent" />
    <header className="site-header"><div className="header-inner">
      <button className="brand" onClick={()=>go('overview')} aria-label="Phi Riemann Observatory home"><span className="brand-mark">Φ</span><span className="brand-copy"><strong>RIEMANN<span> / OBSERVATORY</span></strong><small>OPEN PROOF INTELLIGENCE</small></span></button>
      <nav className={`desktop-nav ${mobileNav?'show':''}`} aria-label="Main navigation">{nav.map(([value,label])=><button key={value} className={tab===value?'active':''} onClick={()=>go(value)} aria-current={tab===value?'page':undefined}>{label}</button>)}</nav>
      <div className="header-controls"><a className="github-icon" href="https://github.com/MichaelWave369/Riemann-Proof-Audit" target="_blank" rel="noopener noreferrer" title="GitHub repository" aria-label="GitHub repository"><Github size={19}/></a><button className="mobile-menu" onClick={()=>setMobileNav(!mobileNav)} aria-label={mobileNav?'Close navigation':'Open navigation'} aria-expanded={mobileNav}>{mobileNav?<X size={20}/>:<Menu size={20}/>}</button></div>
    </div></header>
    <div className="ticker"><div className="ticker-inner"><div><Radio size={13}/><span>RESEARCH STATUS</span><strong>INDEPENDENT VALIDATION NOT ESTABLISHED</strong></div><span>SNAPSHOT / {project.asOf}</span></div></div>
    <main className="main-content" id="content">{tab==='overview'?<Overview go={go}/>:tab==='proof'?<ProofMap/>:tab==='ledger'?<Ledger/>:tab==='workbench'?<AuditWorkbench/>:<Methodology/>}</main>
    <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><span className="brand-mark">Φ</span><div><strong>RIEMANN / OBSERVATORY</strong><span>Built for rigorous curiosity, not premature certainty.</span></div></div><div className="footer-links"><button onClick={()=>go('method')}>Methodology</button><button onClick={()=>go('ledger')}>Evidence ledger</button><a href="https://github.com/MichaelWave369/Riemann-Proof-Audit" target="_blank" rel="noopener noreferrer">View source <ArrowUpRight size={14}/></a></div></div><div className="footer-bottom"><span>© 2026 · An independent PHI369 Labs research initiative</span><span>NO CLAIM OF PROOF CERTIFICATION</span></div></footer>
  </div>;
}
