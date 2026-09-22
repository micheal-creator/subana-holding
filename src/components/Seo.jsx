import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Per-route SEO: sets a unique <title>, meta description, canonical and
// og:title/og:description/og:url as the visitor navigates. Keeps every page's
// metadata distinct (the single-page index.html only carries the homepage).

const SITE = 'https://company.knowyourright.ng'

const ROUTES = [
  { test: /^\/$/, title: 'Subana Holding | Building what matters', desc: 'A Nigerian venture and operating company building useful companies, products and partnerships — including Know Your Right.' },
  { test: /^\/about/, title: 'About Us | Subana Holding', desc: 'How Subana Holding builds for the long term: focus, execution and responsible growth.' },
  { test: /^\/team\//, title: 'Team Member | Subana Holding', desc: 'Profile, focus areas and contact for a Subana Holding team member.' },
  { test: /^\/team/, title: 'Our Team | Subana Holding', desc: 'Meet the people who take ownership at Subana Holding and its projects.' },
  { test: /^\/projects\//, title: 'Project | Subana Holding', desc: 'A Subana Holding project — the problem, the approach and the outcome.' },
  { test: /^\/projects/, title: 'Projects | Subana Holding', desc: 'Products, initiatives and ventures built with the Subana Holding mindset.' },
  { test: /^\/services\//, title: 'Service | Subana Holding', desc: 'How Subana Holding supports the work: strategy, partnerships and delivery.' },
  { test: /^\/services/, title: 'Services | Subana Holding', desc: 'Venture building, digital products, strategic partnerships and growth advisory.' },
  { test: /^\/faq/, title: 'FAQ | Subana Holding', desc: 'Straight answers about Subana Holding, our projects and how to work with us.' },
  { test: /^\/gallery/, title: 'Gallery | Subana Holding', desc: 'A closer look at the people and work behind Subana Holding.' },
  { test: /^\/pricing/, title: 'Working Together | Subana Holding', desc: 'The right shape for the work — how engagements with Subana Holding are structured.' },
  { test: /^\/blog\//, title: 'Insight | Subana Holding', desc: 'Perspectives on building useful businesses, products and partnerships.' },
  { test: /^\/blog/, title: 'Insights | Subana Holding', desc: 'Notes from the field on building useful companies, products and partnerships.' },
  { test: /^\/contact/, title: 'Contact | Subana Holding', desc: 'Talk to Subana Holding about what you are building, exploring or trying to solve.' },
]

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

export default function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const match = ROUTES.find((r) => r.test.test(pathname)) || ROUTES[0]
    const url = `${SITE}${pathname === '/' ? '/' : pathname}`
    document.title = match.title
    setMeta('name', 'description', match.desc)
    setMeta('property', 'og:title', match.title)
    setMeta('property', 'og:description', match.desc)
    setMeta('property', 'og:url', url)

    let link = document.head.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    link.setAttribute('href', url)
  }, [pathname])

  return null
}
