import { useState, useCallback, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Prompt } from '../types/prompt'
import { loadPrompts, savePrompts, resetToDefaults } from '../lib/storage'
import { categorizePrompt } from '../lib/categorize'

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>(() => loadPrompts())

  useEffect(() => {
    savePrompts(prompts)
  }, [prompts])

  const addPrompt = useCallback(
    (data: { title: string; text: string; tags: string[]; category?: string }) => {
      const now = new Date().toISOString()
      const newPrompt: Prompt = {
        id: uuidv4(),
        title: data.title,
        text: data.text,
        tags: data.tags,
        category: data.category || categorizePrompt(data.text),
        createdAt: now,
        updatedAt: now,
        isFavorite: false,
      }
      setPrompts((prev) => [newPrompt, ...prev])
      return newPrompt
    },
    [],
  )

  const updatePrompt = useCallback(
    (id: string, data: Partial<Pick<Prompt, 'title' | 'text' | 'tags' | 'category'>>) => {
      setPrompts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p,
        ),
      )
    },
    [],
  )

  const deletePrompt = useCallback((id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)),
    )
  }, [])

  const resetAll = useCallback(() => {
    resetToDefaults()
    const defaults = loadPrompts()
    setPrompts(defaults)
    savePrompts(defaults)
  }, [])

  return { prompts, addPrompt, updatePrompt, deletePrompt, toggleFavorite, resetAll }
}
