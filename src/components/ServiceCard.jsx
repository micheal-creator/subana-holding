import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../lib/Reveal.jsx'
export default function ServiceCard({ service, index = 0 }) { return <Reveal delay={index * 70}><Link to={`/services/${service.id}`} className="group card block p-6 transition-all hover:-translate-y-1 hover:border-teal"><div className="flex items-start justify-between"><span className="text-3xl text-teal">0{index + 1}</span><ArrowUpRight className="text-muted transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-teal" /></div><h3 className="mt-12 text-2xl">{service.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{service.short}</p></Link></Reveal> }
