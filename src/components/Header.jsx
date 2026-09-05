import { useState } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
const links = [['/', 'Home'], ['/about', 'About'], ['/team', 'Our team'], ['/projects', 'Projects'], ['/services', 'Services'], ['/blog', 'Insights']]
export default function Header() {
  const [open, setOpen] = useState(false)
  return <header className="fixed inset-x-0 top-0 z-40 border-b border-line/70 bg-paper/90 backdrop-blur"><div className="container-site flex h-[76px] items-center justify-between"><Logo /><nav className="hidden items-center gap-7 lg:flex">{links.slice(1).map(([to, label]) => <Link key={to} to={to} className="text-sm font-semibold text-muted transition-colors hover:text-teal">{label}</Link>)}</nav><div className="hidden lg:block"><Link to="/contact" className="btn-primary">Let’s talk <ArrowUpRight size={17} /></Link></div><button className="grid h-11 w-11 place-items-center text-navy lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button></div>{open && <nav className="border-t border-line bg-paper px-5 py-4 lg:hidden">{links.slice(1).map(([to, label]) => <Link onClick={() => setOpen(false)} key={to} to={to} className="block border-b border-line py-3 font-semibold text-navy">{label}</Link>)}<Link onClick={() => setOpen(false)} to="/contact" className="btn-primary mt-4 w-full">Let’s talk <ArrowUpRight size={17} /></Link></nav>}</header>
}
