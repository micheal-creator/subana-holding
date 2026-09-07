import { Link } from 'react-router-dom'

const LOGO = `${import.meta.env.BASE_URL}subana-logo.png`

export default function Logo({ inverse = false }) {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="Subana Holding home">
      <img src={LOGO} alt="" width="40" height="40" className="h-10 w-10 rounded-full bg-white object-contain p-0.5" />
      <span className={`font-display text-[21px] ${inverse ? 'text-white' : 'text-navy'}`}>
        Subana <span className="text-gold">Holding</span>
      </span>
    </Link>
  )
}
