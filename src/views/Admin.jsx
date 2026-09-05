import { useEffect, useMemo, useState } from 'react'
import { Briefcase, Check, ExternalLink, FileText, HelpCircle, Image, LayoutDashboard, LogOut, Newspaper, RotateCcw, Save, Settings, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCms, resetCms, saveCms } from '../cms.js'

const SECTIONS = [
  ['overview', 'Overview', LayoutDashboard], ['team', 'Team', Users], ['projects', 'Projects', Briefcase],
  ['services', 'Services', Settings], ['faqs', 'FAQs', HelpCircle], ['posts', 'Blog posts', Newspaper],
  ['gallery', 'Gallery', Image], ['pricing', 'Pricing', FileText], ['pages', 'Pages', FileText], ['settings', 'Site settings', Settings],
]

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return <div className="grid min-h-[70vh] place-items-center"><form onSubmit={(e) => { e.preventDefault(); localStorage.setItem('subana:admin', '1'); onLogin() }} className="card w-full max-w-md space-y-4 p-7"><div className="grid h-12 w-12 place-items-center rounded-full bg-teal text-white"><Settings /></div><h1 className="text-3xl">Admin workspace</h1><p className="text-sm text-muted">Manage the Subana Holding website.</p><input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /><input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /><button className="btn-primary w-full">Sign in</button><p className="text-xs text-muted">Demo mode: any email and password works until Supabase authentication is connected.</p></form></div>
}

function Editor({ section, cms, setCms }) {
  const [text, setText] = useState(JSON.stringify(cms[section] || {}, null, 2))
  const [message, setMessage] = useState('')
  useEffect(() => setText(JSON.stringify(cms[section] || {}, null, 2)), [section, cms])
  function save() { try { setCms({ ...cms, [section]: JSON.parse(text) }); setMessage('Saved successfully.') } catch { setMessage('Invalid JSON. Check the format before saving.') } }
  return <div className="space-y-5"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Content editor</p><h1 className="mt-2 text-4xl capitalize">{section}</h1><p className="mt-2 text-sm text-muted">Edit this collection and save your changes.</p></div><button onClick={save} className="btn-primary"><Save size={17} /> Save changes</button></div><textarea value={text} onChange={(e) => setText(e.target.value)} spellCheck="false" className="min-h-[60vh] w-full rounded-lg border border-line bg-[#102A43] p-5 font-mono text-sm leading-relaxed text-white outline-none focus:ring-4 focus:ring-teal/20" />{message && <p className="rounded-md bg-soft p-3 text-sm font-semibold text-teal">{message}</p>}</div>
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => localStorage.getItem('subana:admin') === '1')
  const [active, setActive] = useState('overview')
  const [cms, setCms] = useState(getCms)
  if (!authed) return <Login onLogin={() => setAuthed(true)} />
  function update(next) { setCms(next); saveCms(next) }
  const count = useMemo(() => Object.values(cms).reduce((n, value) => n + (Array.isArray(value) ? value.length : 1), 0), [cms])
  return <div className="min-h-[80vh] rounded-lg border border-line bg-white lg:grid lg:grid-cols-[220px_1fr]"><aside className="border-b border-line bg-navy p-4 text-white lg:border-b-0 lg:border-r"><div className="mb-6 flex items-center gap-2 font-display text-xl"><span className="grid h-8 w-8 place-items-center rounded bg-teal text-white">SH</span> CMS</div><nav className="grid grid-cols-2 gap-1 lg:block">{SECTIONS.map(([id, label, I]) => <button key={id} onClick={() => setActive(id)} className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm ${active === id ? 'bg-white text-navy' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}><I size={15} />{label}</button>)}</nav><div className="mt-6 flex gap-2 border-t border-white/10 pt-4"><Link to="/" className="flex items-center gap-2 text-xs text-white/60 hover:text-white"><ExternalLink size={14} />View site</Link><button onClick={() => { localStorage.removeItem('subana:admin'); setAuthed(false) }} className="ml-auto text-white/60 hover:text-white"><LogOut size={15} /></button></div></aside><section className="p-5 sm:p-8">{active === 'overview' ? <><p className="eyebrow">Subana Holding</p><h1 className="mt-2 text-4xl">Website workspace</h1><p className="mt-3 max-w-xl text-muted">Manage your company website content from one place. Edit collections, save changes, and preview the public site.</p><div className="mt-8 grid gap-3 sm:grid-cols-3">{SECTIONS.slice(1, 7).map(([id, label, I]) => <button key={id} onClick={() => setActive(id)} className="card p-4 text-left transition hover:-translate-y-0.5"><I size={20} className="text-teal" /><p className="mt-4 font-display text-xl">{label}</p><p className="mt-1 text-sm text-muted">{Array.isArray(cms[id]) ? cms[id].length : 1} records</p></button>)}</div><div className="mt-8 rounded-lg border border-gold/30 bg-[#fff9ed] p-5"><p className="font-bold text-navy">Demo CMS mode</p><p className="mt-1 text-sm text-muted">{count} editable records are stored in this browser. Connect Supabase for secure multi-user editing, image storage, and publishing across devices.</p><button onClick={() => setCms(resetCms())} className="btn-outline mt-4 text-sm"><RotateCcw size={15} /> Reset demo content</button></div></> : <Editor section={active} cms={cms} setCms={update} />}</section></div>
}
