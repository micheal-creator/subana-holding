import { COMPANY, FAQS, POSTS, PROJECTS, SERVICES, TEAM } from './data.js'

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

export function getCms() {
  let value
  try { value = { ...SEED, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { value = SEED }
  applyToPublicData(value)
  return value
}

export function saveCms(next) {
  const value = { ...next, _revision: Date.now() }
  localStorage.setItem(KEY, JSON.stringify(value))
  applyToPublicData(value)
  window.dispatchEvent(new Event('subana-cms-updated'))
}

export function resetCms() { saveCms(SEED); return SEED }

// Keep the existing public components compatible while moving their source of
// truth from bundled seed arrays to the CMS snapshot. Public pages import these
// arrays directly, so updating them in place makes saved edits visible after
// navigation without requiring a full app rewrite.
function replaceArray(target, next) {
  target.splice(0, target.length, ...(Array.isArray(next) ? next : []))
}

function applyToPublicData(value) {
  Object.assign(COMPANY, value.settings || {})
  replaceArray(TEAM, value.team)
  replaceArray(PROJECTS, value.projects)
  replaceArray(SERVICES, value.services)
  replaceArray(FAQS, (value.faqs || []).map(({ id, ...item }) => item))
  replaceArray(POSTS, value.posts)
}

// Hydrate the public data before the first route renders, including direct
// visits to a detail page.
getCms()
