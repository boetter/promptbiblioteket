import { getDb } from './db'

export async function getSession(req: Request): Promise<{ id: string; email: string } | null> {
  const cookies = req.headers.get('cookie') || ''
  const match = cookies.match(/session=([^;]+)/)
  if (!match) return null

  const sessionId = match[1]
  const db = getDb()
  const result = await db.execute({
    sql: `SELECT s.user_id, u.email FROM sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.id = ? AND s.expires_at > datetime('now')`,
    args: [sessionId],
  })

  if (result.rows.length === 0) return null

  return {
    id: result.rows[0].user_id as string,
    email: result.rows[0].email as string,
  }
}

export function json(data: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  })
}

export function setCookie(name: string, value: string, maxAge: number): string {
  return `${name}=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`
}

export function clearCookie(name: string): string {
  return `${name}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
}
