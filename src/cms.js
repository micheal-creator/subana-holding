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
  try { return { ...SEED, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return SEED }
}

export function saveCms(next) {
  localStorage.setItem(KEY, JSON.stringify(next))
  window.dispatchEvent(new Event('subana-cms-updated'))
}

export function resetCms() { saveCms(SEED); return SEED }
