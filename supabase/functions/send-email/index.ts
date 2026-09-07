// Subana Holding — transactional email sender via Resend.
// Deploy:  supabase functions deploy send-email --no-verify-jwt
// Secrets: supabase secrets set RESEND_API_KEY=... CONTACT_TO=hello@knowyourright.ng FROM_EMAIL="Subana Holding <hello@updates.knowyourright.ng>"

import { serve } from 'https://deno.land/std@0.203.0/http/server.ts'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { ...cors, 'Content-Type': 'application/json' } })
}

function esc(s: string) {
  return String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string))
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405)

  try {
    const { form = 'contact', name = '', email = '', subject = '', message = '' } = await req.json()
    const apiKey = Deno.env.get('RESEND_API_KEY')
    const to = Deno.env.get('CONTACT_TO') || 'hello@knowyourright.ng'
    const from = Deno.env.get('FROM_EMAIL') || 'Subana Holding <hello@updates.knowyourright.ng>'
    if (!apiKey) return json({ ok: false, error: 'Email is not configured yet (missing RESEND_API_KEY).' }, 500)

    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ ok: false, error: 'Invalid email.' }, 400)

    const subjectLine = form === 'newsletter'
      ? `Newsletter signup — ${email}`
      : `Website enquiry — ${subject || 'Contact form'}`
    const html = form === 'newsletter'
      ? `<h2>New newsletter signup</h2><p><b>Email:</b> ${esc(email)}</p>`
      : `<h2>New website enquiry</h2><p><b>Name:</b> ${esc(name)}</p><p><b>Email:</b> ${esc(email)}</p><p><b>Subject:</b> ${esc(subject)}</p><p><b>Message:</b><br/>${esc(message).replace(/\n/g, '<br/>')}</p>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, reply_to: email || undefined, subject: subjectLine, html }),
    })
    if (!res.ok) return json({ ok: false, error: await res.text() }, 502)
    return json({ ok: true })
  } catch (e) {
    return json({ ok: false, error: String(e) }, 400)
  }
})
