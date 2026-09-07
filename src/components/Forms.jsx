import { useState } from 'react'
import { hasSupabase, supabase } from '../supabase.js'

const CONTACT_EMAIL = 'hello@knowyourright.ng'

async function sendEmail(payload) {
  if (!hasSupabase) throw new Error('no-backend')
  const { data, error } = await supabase.functions.invoke('send-email', { body: payload })
  if (error || !data?.ok) throw new Error(error?.message || data?.error || 'send-failed')
  return true
}

function mailtoFallback({ subject, body }) {
  const url = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.location.href = url
}

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      await sendEmail({ form: 'contact', ...form })
      setStatus('sent')
    } catch {
      mailtoFallback({
        subject: `Website enquiry — ${form.subject || 'Contact'}`,
        body: `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
      })
      setStatus('sent')
    }
  }

  if (status === 'sent')
    return (
      <div className="card p-6 sm:p-8">
        <div className="py-12 text-center">
          <p className="eyebrow">Message received</p>
          <h3 className="mt-3 text-3xl">Thank you for reaching out.</h3>
          <p className="mt-3 text-muted">Our team will review your message and get back to you.</p>
        </div>
      </div>
    )

  return (
    <form onSubmit={submit} className="card space-y-4 p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <input className="input" required placeholder="Your name" value={form.name} onChange={set('name')} />
        <input className="input" type="email" required placeholder="Email address" value={form.email} onChange={set('email')} />
      </div>
      <input className="input" required placeholder="Subject" value={form.subject} onChange={set('subject')} />
      <textarea className="input min-h-36 resize-y" required placeholder="Tell us a little about your enquiry" value={form.message} onChange={set('message')} />
      <label className="flex items-start gap-2 text-xs text-muted"><input type="checkbox" required className="mt-1" /> I agree that Subana Holding may use these details to respond to my enquiry.</label>
      <button className="btn-primary w-full sm:w-auto" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send enquiry'}</button>
    </form>
  )
}

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  async function submit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      await sendEmail({ form: 'newsletter', email })
      setStatus('done')
    } catch {
      mailtoFallback({ subject: 'Newsletter signup', body: `Please add me to the newsletter: ${email}` })
      setStatus('done')
    }
  }

  if (status === 'done') return <p className="text-sm text-white/75">You’re on the list. Thank you.</p>

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
      <input className="min-h-12 flex-1 rounded-md border border-white/20 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/45" required type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button className="btn-gold" type="submit" disabled={status === 'sending'}>{status === 'sending' ? '…' : 'Subscribe'}</button>
    </form>
  )
}
