import { getDb } from './_shared/db'
import { getSession, json } from './_shared/auth'

export default async (req: Request) => {
  if (req.method !== 'PUT') return json({ error: 'Method not allowed' }, 405)

  const user = await getSession(req)
  if (!user) return json({ error: 'Unauthorized' }, 401)

  const { id, title, text, tags, category } = await req.json()
  if (!id) return json({ error: 'Prompt ID required' }, 400)

  const db = getDb()
  const now = new Date().toISOString()

  await db.execute({
    sql: `UPDATE user_prompts SET title = ?, text = ?, tags = ?, category = ?, updated_at = ?
          WHERE id = ? AND user_id = ?`,
    args: [title, text, JSON.stringify(tags || []), category || 'Andet', now, id, user.id],
  })

  return json({ ok: true })
}

export const config = { path: '/api/prompts/update' }
