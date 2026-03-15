import { Resend } from 'resend'
import { getDb } from './_shared/db'
import { json } from './_shared/auth'

export default async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const { email } = await req.json()
  if (!email || typeof email !== 'string') return json({ error: 'Email required' }, 400)

  const normalized = email.trim().toLowerCase()
  const db = getDb()
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

  await db.execute({
    sql: 'INSERT INTO auth_tokens (token, email, expires_at) VALUES (?, ?, ?)',
    args: [token, normalized, expiresAt],
  })

  const siteUrl = process.env.SITE_URL || 'https://promptbiblioteket.netlify.app'
  const verifyUrl = `${siteUrl}/api/auth/verify?token=${token}`

  const resend = new Resend(process.env.RESEND_API_KEY)
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Promptbiblioteket <onboarding@resend.dev>'

  await resend.emails.send({
    from: fromEmail,
    to: normalized,
    subject: 'Log ind på Promptbiblioteket',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #1e1e1e; margin-bottom: 8px;">Log ind på Promptbiblioteket</h2>
        <p style="color: #666; line-height: 1.6;">
          Klik på knappen nedenfor for at logge ind. Linket udløber om 15 minutter.
        </p>
        <a href="${verifyUrl}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 24px 0;">
          Log ind
        </a>
        <p style="color: #999; font-size: 13px; margin-top: 32px;">
          Hvis du ikke har anmodet om dette link, kan du ignorere denne email.
        </p>
      </div>
    `,
  })

  return json({ ok: true })
}

export const config = { path: '/api/auth/send-link' }
