import { getDb } from './_shared/db'
import { json, clearCookie } from './_shared/auth'

export default async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const cookies = req.headers.get('cookie') || ''
  const match = cookies.match(/session=([^;]+)/)
  if (match) {
    const db = getDb()
    await db.execute({ sql: 'DELETE FROM sessions WHERE id = ?', args: [match[1]] })
  }

  return json({ ok: true }, 200, { 'Set-Cookie': clearCookie('session') })
}

export const config = { path: '/api/auth/logout' }
