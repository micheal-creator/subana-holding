import { useEffect, useMemo, useState } from 'react'
import { Briefcase, Check, ExternalLink, FileText, HelpCircle, Image, LayoutDashboard, LogOut, Newspaper, Plus, RotateCcw, Save, Settings, Trash2, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCms, resetCms, saveCms, uploadMedia } from '../cms.js'
import { hasSupabase, supabase } from '../supabase.js'

const SECTIONS = [
  ['team', 'Team', Users], ['projects', 'Projects', Briefcase], ['services', 'Services', Settings],
  ['faqs', 'FAQs', HelpCircle], ['posts', 'Blog posts', Newspaper], ['gallery', 'Gallery', Image],
  ['pricing', 'Pricing', FileText], ['pages', 'Pages', FileText], ['settings', 'Site settings', Settings],
]

const FIELD_CONFIG = {
  team: [
    ['name', 'Name', 'text'], ['role', 'Role', 'text'], ['bio', 'Biography', 'textarea'],
    ['focus', 'Areas of focus', 'list'], ['image', 'Portrait image URL or uploaded image', 'image'],
    ['instagram', 'Instagram URL', 'url'], ['linkedin', 'LinkedIn URL', 'url'],
  ],
  projects: [
    ['title', 'Project name', 'text'], ['category', 'Category', 'text'], ['summary', 'Short summary', 'textarea'],
    ['body', 'Full description', 'textarea'], ['year', 'Year', 'text'], ['image', 'Project image URL or upload', 'image'],
    ['link', 'Project website URL', 'url'], ['fallback', 'Fallback/app URL', 'url'],
  ],
  services: [
    ['title', 'Service name', 'text'], ['short', 'Short description', 'textarea'], ['body', 'Full description', 'textarea'],
    ['image', 'Service image URL or upload', 'image'],
  ],
  faqs: [['q', 'Question', 'text'], ['a', 'Answer', 'textarea']],
  posts: [['title', 'Post title', 'text'], ['category', 'Category', 'text'], ['date', 'Publish date', 'text'], ['excerpt', 'Excerpt', 'textarea']],
  gallery: [['title', 'Gallery title', 'text'], ['description', 'Description', 'textarea'], ['image', 'Image URL or upload', 'image']],
  pricing: [['title', 'Plan name', 'text'], ['description', 'Description', 'textarea'], ['cta', 'Button text', 'text'], ['visible', 'Visible on website', 'boolean']],
  pages: [['title', 'Page title', 'text'], ['status', 'Status', 'select'], ['content', 'Page content', 'textarea']],
}

const inputClass = 'input'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  async function submit(e) { e.preventDefault(); if (hasSupabase) { const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) { alert(error.message); return } } localStorage.setItem('subana:admin', '1'); onLogin() }
  return <div className="grid min-h-[70vh] place-items-center"><form onSubmit={submit} className="card w-full max-w-md space-y-4 p-7"><div className="grid h-12 w-12 place-items-center rounded-full bg-teal text-white"><Settings /></div><h1 className="text-3xl">Admin workspace</h1><p className="text-sm text-muted">Manage Subana Holding without editing code.</p><input className={inputClass} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /><input className={inputClass} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /><button className="btn-primary w-full">Sign in</button><p className="text-xs text-muted">{hasSupabase ? 'Use your approved Supabase admin account.' : 'Demo mode: any email and password works.'}</p></form></div>
}

function Field({ config, value, onChange }) {
  const [key, label, type] = config
  if (type === 'textarea') return <label className="block space-y-1.5"><span className="field-label">{label}</span><textarea className={`${inputClass} min-h-28 resize-y`} value={value || ''} onChange={(e) => onChange(key, e.target.value)} /></label>
  if (type === 'list') return <label className="block space-y-1.5"><span className="field-label">{label} <span className="font-normal text-faint">(separate with commas)</span></span><input className={inputClass} value={Array.isArray(value) ? value.join(', ') : value || ''} onChange={(e) => onChange(key, e.target.value.split(',').map((x) => x.trim()).filter(Boolean))} /></label>
  if (type === 'boolean') return <label className="flex min-h-12 items-center gap-3 rounded-md border border-line px-4"><input type="checkbox" checked={value !== false} onChange={(e) => onChange(key, e.target.checked)} /><span className="text-sm font-semibold">{label}</span></label>
  if (type === 'select') return <label className="block space-y-1.5"><span className="field-label">{label}</span><select className={inputClass} value={value || 'published'} onChange={(e) => onChange(key, e.target.value)}><option value="published">Published</option><option value="draft">Draft</option></select></label>
  if (type === 'image') return <label className="block space-y-1.5"><span className="field-label">{label}</span>{value && <img src={value} alt="Current" className="mb-2 h-32 w-full rounded-md object-cover" />}<input className={inputClass} value={value || ''} onChange={(e) => onChange(key, e.target.value)} placeholder="https://… or upload below" /><input type="file" accept="image/*" className="mt-2 block w-full text-xs text-muted" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; try { onChange(key, await uploadMedia(file)) } catch { alert('Image upload failed. Check Supabase Storage and admin permissions.') } }} /></label>
  return <label className="block space-y-1.5"><span className="field-label">{label}</span><input className={inputClass} type={type} value={value || ''} onChange={(e) => onChange(key, e.target.value)} /></label>
}

function RecordEditor({ section, item, onSave, onCancel }) {
  const [draft, setDraft] = useState(item || {})
  useEffect(() => setDraft(item || {}), [item])
  const fields = FIELD_CONFIG[section] || []
  function change(key, value) { setDraft((current) => ({ ...current, [key]: value })) }
  return <div className="card space-y-5 p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Edit {section}</p><h2 className="mt-1 text-2xl">{item ? 'Edit details' : 'Add new item'}</h2><p className="mt-1 text-sm text-muted">Use the labeled fields below. No code required.</p></div><button type="button" onClick={onCancel} className="btn-outline btn-sm">Cancel</button></div><div className="grid gap-4 sm:grid-cols-2">{fields.map((field) => <Field key={field[0]} config={field} value={draft[field[0]]} onChange={change} />)}</div><div className="flex flex-wrap gap-2 border-t border-line pt-4"><button type="button" onClick={() => onSave(draft)} className="btn-primary"><Save size={17} /> Save item</button></div></div>
}

function CollectionEditor({ section, cms, setCms }) {
  const [editing, setEditing] = useState(null)
  const items = Array.isArray(cms[section]) ? cms[section] : []
  const fields = FIELD_CONFIG[section] || []
  function saveItem(item) { const next = editing?.index == null ? [...items, { ...item, id: item.id || `${section}-${Date.now()}` }] : items.map((x, i) => i === editing.index ? { ...x, ...item } : x); setCms({ ...cms, [section]: next }); setEditing(null) }
  function remove(index) { if (confirm('Remove this item from the website?')) setCms({ ...cms, [section]: items.filter((_, i) => i !== index) }) }
  if (editing) return <RecordEditor section={section} item={editing.item} onSave={saveItem} onCancel={() => setEditing(null)} />
  return <div className="space-y-5"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Content manager</p><h1 className="mt-2 text-4xl capitalize">{section}</h1><p className="mt-2 text-sm text-muted">Add, edit, reorder or remove {section} items visually.</p></div><button onClick={() => setEditing({ item: Object.fromEntries(fields.map(([key]) => [key, key === 'visible' ? true : ''])) })} className="btn-primary"><Plus size={17} /> Add {section === 'posts' ? 'post' : section.slice(0, -1) || 'item'}</button></div><div className="space-y-3">{items.map((item, index) => <div key={item.id || index} className="card flex items-center gap-4 p-4"><div className="min-w-0 flex-1">{item.image && <img src={item.image} alt="" className="mb-3 h-20 w-28 rounded-md object-cover" />}<p className="truncate font-display text-xl">{item.name || item.title || item.q || item.question || `Item ${index + 1}`}</p><p className="mt-1 line-clamp-2 text-sm text-muted">{item.role || item.summary || item.short || item.a || item.description || item.content || ''}</p></div><button onClick={() => setEditing({ item, index })} className="btn-outline btn-sm"><FileText size={15} /> Edit</button><button onClick={() => remove(index)} className="btn-outline btn-sm text-red-700"><Trash2 size={15} /> Delete</button></div>)}{items.length === 0 && <div className="card p-8 text-center text-muted">No items yet. Click “Add” to create one.</div>}</div></div>
}

function SettingsEditor({ cms, setCms }) {
  const [draft, setDraft] = useState(cms.settings)
  function save() { setCms({ ...cms, settings: draft }); alert('Site settings saved.') }
  return <div className="space-y-5"><p className="eyebrow">Global settings</p><h1 className="mt-2 text-4xl">Site settings</h1><p className="text-sm text-muted">Update the company name, contact details, announcement and SEO title.</p><div className="card grid gap-4 p-5 sm:grid-cols-2">{[['name','Company name'],['tagline','Tagline'],['email','Email'],['phone','Phone'],['address','Address'],['announcement','Announcement'],['seoTitle','SEO title']].map(([key,label]) => <label key={key} className="block space-y-1.5"><span className="field-label">{label}</span><input className={inputClass} value={draft?.[key] || ''} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} /></label>)}</div><button onClick={save} className="btn-primary"><Save size={17} /> Save settings</button></div>
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => localStorage.getItem('subana:admin') === '1')
  const [active, setActive] = useState('overview')
  const [cms, setCms] = useState(getCms)
  if (!authed) return <Login onLogin={() => setAuthed(true)} />
  function update(next) { setCms(next); saveCms(next) }
  const count = useMemo(() => Object.values(cms).reduce((n, value) => n + (Array.isArray(value) ? value.length : 1), 0), [cms])
  return <div className="min-h-[80vh] rounded-lg border border-line bg-white lg:grid lg:grid-cols-[230px_1fr]"><aside className="border-b border-line bg-navy p-4 text-white lg:border-b-0 lg:border-r"><div className="mb-6 flex items-center gap-2 font-display text-xl"><span className="grid h-8 w-8 place-items-center rounded bg-teal text-white">SH</span> CMS</div><nav className="grid grid-cols-2 gap-1 lg:block"><button onClick={() => setActive('overview')} className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm ${active === 'overview' ? 'bg-white text-navy' : 'text-white/70 hover:bg-white/10'}`}><LayoutDashboard size={15} />Overview</button>{SECTIONS.map(([id, label, I]) => <button key={id} onClick={() => setActive(id)} className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm ${active === id ? 'bg-white text-navy' : 'text-white/70 hover:bg-white/10'}`}><I size={15} />{label}</button>)}</nav><div className="mt-6 flex gap-2 border-t border-white/10 pt-4"><Link to="/" className="flex items-center gap-2 text-xs text-white/60 hover:text-white"><ExternalLink size={14} />View site</Link><button onClick={() => { localStorage.removeItem('subana:admin'); setAuthed(false) }} className="ml-auto text-white/60 hover:text-white"><LogOut size={15} /></button></div></aside><section className="p-5 sm:p-8">{active === 'overview' ? <><p className="eyebrow">Subana Holding</p><h1 className="mt-2 text-4xl">Website workspace</h1><p className="mt-3 max-w-xl text-muted">Edit your website using forms instead of code. Choose a section from the left, update its fields, and save.</p><div className="mt-8 grid gap-3 sm:grid-cols-3">{SECTIONS.slice(0, 6).map(([id, label, I]) => <button key={id} onClick={() => setActive(id)} className="card p-4 text-left transition hover:-translate-y-0.5"><I size={20} className="text-teal" /><p className="mt-4 font-display text-xl">{label}</p><p className="mt-1 text-sm text-muted">{Array.isArray(cms[id]) ? cms[id].length : 1} records</p></button>)}</div><div className="mt-8 rounded-lg border border-gold/30 bg-[#fff9ed] p-5"><p className="font-bold text-navy">Demo CMS mode</p><p className="mt-1 text-sm text-muted">{count} editable records are stored in this browser. Changes are saved when you click Save.</p><button onClick={() => setCms(resetCms())} className="btn-outline mt-4 text-sm"><RotateCcw size={15} /> Reset demo content</button></div></> : active === 'settings' ? <SettingsEditor cms={cms} setCms={update} /> : <CollectionEditor section={active} cms={cms} setCms={update} />}</section></div>
}
