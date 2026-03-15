import { getDb } from './_shared/db'
import { setCookie } from './_shared/auth'

export default async (req: Request) => {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')

  if (!token) {
    return new Response('Token mangler', { status: 400 })
  }

  const db = getDb()

  const tokenResult = await db.execute({
    sql: `SELECT email FROM auth_tokens WHERE token = ? AND used = 0 AND expires_at > datetime('now')`,
    args: [token],
  })

  if (tokenResult.rows.length === 0) {
    const siteUrl = process.env.SITE_URL || 'https://promptbiblioteket.netlify.app'
    return new Response(null, {
      status: 302,
      headers: { Location: `${siteUrl}?error=invalid_token` },
    })
  }

  const email = tokenResult.rows[0].email as string

  // Mark token as used
  await db.execute({ sql: 'UPDATE auth_tokens SET used = 1 WHERE token = ?', args: [token] })

  // Find or create user
  let userResult = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [email] })

  let userId: string
  if (userResult.rows.length === 0) {
    userId = crypto.randomUUID()
    await db.execute({ sql: 'INSERT INTO users (id, email) VALUES (?, ?)', args: [userId, email] })
  } else {
    userId = userResult.rows[0].id as string
  }

  // Create session (30 days)
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  await db.execute({
    sql: 'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
    args: [sessionId, userId, expiresAt],
  })

  const siteUrl = process.env.SITE_URL || 'https://promptbiblioteket.netlify.app'
  const cookie = setCookie('session', sessionId, 30 * 24 * 60 * 60)

  return new Response(null, {
    status: 302,
    headers: {
      Location: siteUrl,
      'Set-Cookie': cookie,
    },
  })
}

export const config = { path: '/api/auth/verify' }
