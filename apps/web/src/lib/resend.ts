import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY

/** Server-only Resend client. Null when RESEND_API_KEY is unset (scaffold-safe). */
export const resend = apiKey ? new Resend(apiKey) : null

export const CONTACT_TO = process.env.CONTACT_TO_EMAIL ?? 'karenrortizg@gmail.com'

/**
 * Sender address — use an address on your verified Resend domain (e.g. hola@karenrebecaortiz.com).
 * Sandbox default `onboarding@resend.dev` only delivers to your Resend account email.
 */
export const CONTACT_FROM =
  process.env.CONTACT_FROM_EMAIL ?? 'Karen Ortiz <hola@karenrebecaortiz.com>'
