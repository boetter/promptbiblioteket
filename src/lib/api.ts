export interface ApiUser {
  id: string
  email: string
}

export interface ApiPrompt {
  id: string
  title: string
  text: string
  tags: string[]
  category: string
  isFavorite: boolean
  sourceId: string | null
  createdAt: string
  updatedAt: string
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `HTTP ${res.status}`)
  }
  return res.json()
}

// Auth
export async function sendMagicLink(email: string) {
  return request<{ ok: boolean }>('/api/auth/send-link', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function getMe() {
  return request<{ user: ApiUser | null }>('/api/auth/me')
}

export async function logout() {
  return request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' })
}

// Prompts
export async function fetchPrompts() {
  return request<{ prompts: ApiPrompt[] }>('/api/prompts')
}

export async function createPrompt(data: {
  title: string
  text: string
  tags: string[]
  category: string
  sourceId?: string
}) {
  return request<{ prompt: ApiPrompt }>('/api/prompts', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updatePrompt(
  id: string,
  data: { title: string; text: string; tags: string[]; category: string },
) {
  return request<{ ok: boolean }>('/api/prompts/update', {
    method: 'PUT',
    body: JSON.stringify({ id, ...data }),
  })
}

export async function deletePrompt(id: string) {
  return request<{ ok: boolean }>('/api/prompts/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
  })
}

export async function toggleFavorite(id: string) {
  return request<{ ok: boolean }>('/api/prompts/favorite', {
    method: 'POST',
    body: JSON.stringify({ id }),
  })
}
