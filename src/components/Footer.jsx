import { ArrowUpRight, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { COMPANY, PROJECTS } from '../data.js'

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <Logo inverse />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">{COMPANY.intro}</p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-gold">Start a conversation <ArrowUpRight size={16} /></Link>
        </div>
        <div>
          <p className="eyebrow text-gold">Navigate</p>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <Link to="/about">About us</Link><Link to="/team">Our team</Link><Link to="/projects">Projects</Link><Link to="/services">Services</Link><Link to="/blog">Insights</Link><Link to="/faq">FAQ</Link>
          </div>
        </div>
        <div>
          <p className="eyebrow text-gold">Get in touch</p>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2"><Mail size={15} /> {COMPANY.email}</a>
            <span className="flex items-start gap-2"><MapPin size={15} className="mt-0.5" /> {COMPANY.address}</span>
          </div>
          <p className="mt-7 text-xs leading-relaxed text-white/45">Know Your Right is a Subana Holding project.<br />Product: <a className="text-white/70 underline" href={PROJECTS[0].link}>knowyourright.ng</a></p>
        </div>
      </div>
      <div className="border-t border-white/10"><div className="container-site flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} Subana Holding. All rights reserved.</span><span>Built in Nigeria.</span></div></div>
    </footer>
  )
}
