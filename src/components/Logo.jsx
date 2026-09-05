import { Hexagon } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Logo({ inverse = false }) {
  return <Link to="/" className="flex items-center gap-3" aria-label="Subana Holding home"><span className="grid h-10 w-10 place-items-center bg-teal text-white"><Hexagon size={22} strokeWidth={1.5} /></span><span className={`font-display text-[21px] ${inverse ? 'text-white' : 'text-navy'}`}>Subana <span className="text-gold">Holding</span></span></Link>
}
