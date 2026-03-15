import { getDb } from './_shared/db'
import { getSession, json } from './_shared/auth'

export default async (req: Request) => {
  const user = await getSession(req)
  if (!user) return json({ error: 'Unauthorized' }, 401)

  const db = getDb()

  if (req.method === 'GET') {
    const result = await db.execute({
      sql: 'SELECT * FROM user_prompts WHERE user_id = ? ORDER BY created_at DESC',
      args: [user.id],
    })

    const prompts = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      text: row.text,
      tags: JSON.parse(row.tags as string),
      category: row.category,
      isFavorite: row.is_favorite === 1,
      sourceId: row.source_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))

    return json({ prompts })
  }

  if (req.method === 'POST') {
    const { title, text, tags, category, sourceId } = await req.json()

    if (!title || !text) return json({ error: 'Title and text required' }, 400)

    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    await db.execute({
      sql: `INSERT INTO user_prompts (id, user_id, title, text, tags, category, source_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, user.id, title, text, JSON.stringify(tags || []), category || 'Andet', sourceId || null, now, now],
    })

    return json({
      prompt: {
        id,
        title,
        text,
        tags: tags || [],
        category: category || 'Andet',
        isFavorite: false,
        sourceId: sourceId || null,
        createdAt: now,
        updatedAt: now,
      },
    })
  }

  return json({ error: 'Method not allowed' }, 405)
}

export const config = { path: '/api/prompts' }
