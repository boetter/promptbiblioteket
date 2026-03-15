import { getSession, json } from './_shared/auth'

export default async (req: Request) => {
  const user = await getSession(req)
  return json({ user })
}

export const config = { path: '/api/auth/me' }
