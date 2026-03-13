import type { Prompt } from '../types/prompt'

const STORAGE_KEY = 'promptbiblioteket_prompts'

export function loadPrompts(): Prompt[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function savePrompts(prompts: Prompt[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts))
}
