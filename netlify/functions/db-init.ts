import { initSchema } from './_shared/db'
import { json } from './_shared/auth'

export default async (req: Request) => {
  const url = new URL(req.url)
  const secret = url.searchParams.get('secret')

  // Simple protection - set DB_INIT_SECRET env var to use this
  if (process.env.DB_INIT_SECRET && secret !== process.env.DB_INIT_SECRET) {
    return json({ error: 'Unauthorized' }, 401)
  }

  try {
    await initSchema()
    return json({ ok: true, message: 'Schema created successfully' })
  } catch (error) {
    return json({ error: String(error) }, 500)
  }
}

export const config = { path: '/api/db-init' }
