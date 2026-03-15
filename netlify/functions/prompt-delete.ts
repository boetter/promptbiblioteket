import { getDb } from './_shared/db'
import { getSession, json } from './_shared/auth'

export default async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const user = await getSession(req)
  if (!user) return json({ error: 'Unauthorized' }, 401)

  const { id } = await req.json()
  if (!id) return json({ error: 'Prompt ID required' }, 400)

  const db = getDb()
  await db.execute({
    sql: 'DELETE FROM user_prompts WHERE id = ? AND user_id = ?',
    args: [id, user.id],
  })

  return json({ ok: true })
}

export const config = { path: '/api/prompts/delete' }
