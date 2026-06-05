import { NextResponse } from 'next/server'
import { resend, CONTACT_TO, CONTACT_FROM } from '@/lib/resend'

export const runtime = 'nodejs'

type ContactPayload = {
  name?: string
  email?: string
  phone?: string
  country?: string
  services?: string[]
  budget?: string | null
  message?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX = { name: 120, email: 254, phone: 40, country: 80, message: 8000 } as const

export async function POST(request: Request) {
  let body: ContactPayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_request' }, { status: 400 })
  }

  const name = (body.name?.trim() ?? '').slice(0, MAX.name)
  const email = (body.email?.trim() ?? '').slice(0, MAX.email)
  const message = (body.message?.trim() ?? '').slice(0, MAX.message)
  const phone = body.phone?.trim().slice(0, MAX.phone)
  const country = body.country?.trim().slice(0, MAX.country)
  const services = Array.isArray(body.services)
    ? body.services.filter((s): s is string => typeof s === 'string').slice(0, 8)
    : []
  const budget = typeof body.budget === 'string' ? body.budget.slice(0, 40) : null

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 })
  }

  if (!resend) {
    console.error('[contact] RESEND_API_KEY is not set')
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 })
  }

  // Resend's Node SDK returns { data, error } — it does NOT throw on API errors.
  const { data, error } = await resend.emails.send(
    {
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject: `New project brief — ${name}`,
      html: renderEmail({ name, email, message, phone, country, services, budget }),
    },
    // Dedupe accidental double-submits within the 24h idempotency window.
    { idempotencyKey: `contact-form/${email}:${hash(message)}` },
  )

  if (error) {
    console.error('[contact] resend error:', error.message)
    const sandbox =
      /only send testing emails to your own email/i.test(error.message) ||
      /verify a domain/i.test(error.message)
    return NextResponse.json(
      { ok: false, error: sandbox ? 'sandbox_restricted' : 'send_failed' },
      { status: sandbox ? 503 : 502 },
    )
  }

  return NextResponse.json({ ok: true, id: data?.id })
}

function renderEmail(d: ContactPayload): string {
  const rows: Array<[string, string | undefined | null]> = [
    ['Name', d.name],
    ['Email', d.email],
    ['Phone', d.phone],
    ['Country', d.country],
    ['Services', d.services?.length ? d.services.join(', ') : undefined],
    ['Budget', d.budget],
  ]

  const tableRows = rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#71717a;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:6px 0;font-size:14px;color:#11221f;">${escapeHtml(String(value))}</td></tr>`,
    )
    .join('')

  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;color:#11221f;">
    <h2 style="font-size:18px;margin:0 0 4px;">New project brief</h2>
    <p style="margin:0 0 20px;color:#71717a;font-size:13px;">From the karenrebecaortiz.com contact form</p>
    <table style="border-collapse:collapse;width:100%;">${tableRows}</table>
    <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e4dfcf;">
      <div style="color:#71717a;font-size:13px;margin-bottom:6px;">Message</div>
      <div style="font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(d.message ?? '')}</div>
    </div>
  </div>`
}

function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&': return '&amp;'
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '"': return '&quot;'
      default: return '&#39;'
    }
  })
}

function hash(input: string): string {
  let h = 5381
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) >>> 0
  return h.toString(36)
}
