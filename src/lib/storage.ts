import { v4 as uuidv4 } from 'uuid'
import type { Prompt } from '../types/prompt'
import { DEFAULT_PROMPTS } from '../data/defaultPrompts'

const STORAGE_KEY = 'promptbiblioteket_prompts'
const INITIALIZED_KEY = 'promptbiblioteket_initialized'

function generatePromptsFromDefaults(): Prompt[] {
  const now = new Date().toISOString()
  return DEFAULT_PROMPTS.map((d) => ({
    id: uuidv4(),
    title: d.title,
    text: d.text,
    tags: d.tags,
    category: d.category,
    createdAt: now,
    updatedAt: now,
    isFavorite: false,
  }))
}

export function loadPrompts(): Prompt[] {
  try {
    if (!localStorage.getItem(INITIALIZED_KEY)) {
      const prompts = generatePromptsFromDefaults()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts))
      localStorage.setItem(INITIALIZED_KEY, '1')
      return prompts
    }
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error('Failed to load prompts:', e)
    return []
  }
}

export function savePrompts(prompts: Prompt[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts))
}

export function resetToDefaults(): void {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(INITIALIZED_KEY)
}
