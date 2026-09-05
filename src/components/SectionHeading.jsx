import Reveal from '../lib/Reveal.jsx'
export default function SectionHeading({ eyebrow, title, text }) { return <div className="max-w-2xl"><Reveal><p className="eyebrow">{eyebrow}</p><h2 className="mt-3 text-4xl sm:text-5xl">{title}</h2>{text && <p className="mt-4 text-base leading-relaxed text-muted">{text}</p>}</Reveal></div> }
