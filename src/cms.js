import { COMPANY, FAQS, POSTS, PROJECTS, SERVICES, TEAM } from './data.js'
import { hasSupabase, supabase } from './supabase.js'

const KEY = 'subana:cms:v1'
const SEED = {
  settings: { ...COMPANY, announcement: 'Building what matters.', seoTitle: 'Subana Holding | Building what matters.' },
  team: TEAM,
  projects: PROJECTS,
  services: SERVICES,
  faqs: FAQS.map((item, index) => ({ ...item, id: `faq-${index + 1}` })),
  posts: POSTS,
  gallery: [],
  pricing: [
    { id: 'explore', title: 'Explore', description: 'For early conversations', cta: 'Let’s talk', visible: true },
    { id: 'build', title: 'Build', description: 'For active venture work', cta: 'Start a conversation', visible: true },
    { id: 'partner', title: 'Partner', description: 'For long-term collaboration', cta: 'Contact our team', visible: true },
  ],
  pages: [
    { id: 'about', title: 'About Us', status: 'published', content: 'We build for the long term.' },
    { id: 'contact', title: 'Contact', status: 'published', content: 'Let’s talk about what’s next.' },
  ],
}

function localCms() {
  try { return { ...SEED, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return SEED }
}

export function getCms() {
  const value = localCms()
  applyToPublicData(value)
  return value
}

export async function loadCms() {
  if (!hasSupabase) return getCms()
  const [{ data: settings }, { data: rows, error }] = await Promise.all([
    supabase.from('site_settings').select('data').eq('id', 'global').maybeSingle(),
    supabase.from('site_content').select('collection,slug,data,status,sort_order').eq('status', 'published').order('sort_order'),
  ])
  if (error) throw error
  if (!settings && (!rows || rows.length === 0)) return getCms()
  const value = { ...SEED, settings: settings?.data || SEED.settings }
  for (const key of ['team', 'projects', 'services', 'faqs', 'posts', 'gallery', 'pricing', 'pages']) {
    const found = (rows || []).filter((r) => r.collection === key).map((r) => ({ id: r.slug, ...r.data }))
    if (found.length) value[key] = found
  }
  value._revision = Date.now()
  localStorage.setItem(KEY, JSON.stringify(value))
  applyToPublicData(value)
  return value
}

export async function saveCms(next) {
  const value = { ...next, _revision: Date.now() }
  localStorage.setItem(KEY, JSON.stringify(value))
  applyToPublicData(value)
  if (hasSupabase) {
    const { error: settingsError } = await supabase.from('site_settings').upsert({ id: 'global', data: value.settings, updated_at: new Date().toISOString() })
    if (settingsError) throw settingsError
    const collections = ['team', 'projects', 'services', 'faqs', 'posts', 'gallery', 'pricing', 'pages']
    for (const collection of collections) {
      const items = Array.isArray(value[collection]) ? value[collection] : []
      const { error: deleteError } = await supabase.from('site_content').delete().eq('collection', collection)
      if (deleteError) throw deleteError
      if (items.length) {
        const rows = items.map((item, index) => {
          const { id, ...data } = item
          return { collection, slug: id || `${collection}-${index + 1}`, data, status: item.status || 'published', sort_order: index, updated_at: new Date().toISOString() }
        })
        const { error } = await supabase.from('site_content').insert(rows)
        if (error) throw error
      }
    }
  }
  window.dispatchEvent(new Event('subana-cms-updated'))
  return value
}

export async function uploadMedia(file) {
  if (!hasSupabase) {
    return await new Promise((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(file) })
  }
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('site-media').upload(path, file, { upsert: false })
  if (error) throw error
  return supabase.storage.from('site-media').getPublicUrl(path).data.publicUrl
}

export async function resetCms() { await saveCms(SEED); return SEED }

function replaceArray(target, next) { target.splice(0, target.length, ...(Array.isArray(next) ? next : [])) }
function applyToPublicData(value) {
  Object.assign(COMPANY, value.settings || {})
  replaceArray(TEAM, value.team)
  replaceArray(PROJECTS, value.projects)
  replaceArray(SERVICES, value.services)
  replaceArray(FAQS, (value.faqs || []).map(({ id, ...item }) => item))
  replaceArray(POSTS, value.posts)
}

getCms()
