import { useState, useCallback, useEffect } from 'react'
import type { Prompt } from '../types/prompt'
import * as api from '../lib/api'
import { categorizePrompt } from '../lib/categorize'

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .fetchPrompts()
      .then(({ prompts }) =>
        setPrompts(
          prompts.map((p) => ({
            id: p.id,
            title: p.title,
            text: p.text,
            tags: p.tags,
            category: p.category,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            isFavorite: p.isFavorite,
          })),
        ),
      )
      .catch(() => setPrompts([]))
      .finally(() => setLoading(false))
  }, [])

  const addPrompt = useCallback(
    async (data: { title: string; text: string; tags: string[]; category?: string; sourceId?: string }) => {
      const category = data.category || categorizePrompt(data.text)
      const { prompt: p } = await api.createPrompt({
        title: data.title,
        text: data.text,
        tags: data.tags,
        category,
        sourceId: data.sourceId,
      })
      const newPrompt: Prompt = {
        id: p.id,
        title: p.title,
        text: p.text,
        tags: p.tags,
        category: p.category,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        isFavorite: p.isFavorite,
      }
      setPrompts((prev) => [newPrompt, ...prev])
      return newPrompt
    },
    [],
  )

  const updatePrompt = useCallback(
    async (id: string, data: Partial<Pick<Prompt, 'title' | 'text' | 'tags' | 'category'>>) => {
      const current = prompts.find((p) => p.id === id)
      if (!current) return

      const updated = {
        title: data.title ?? current.title,
        text: data.text ?? current.text,
        tags: data.tags ?? current.tags,
        category: data.category ?? current.category,
      }

      await api.updatePrompt(id, updated)
      setPrompts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updated, updatedAt: new Date().toISOString() } : p)),
      )
    },
    [prompts],
  )

  const deletePrompt = useCallback(async (id: string) => {
    await api.deletePrompt(id)
    setPrompts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const toggleFavorite = useCallback(async (id: string) => {
    await api.toggleFavorite(id)
    setPrompts((prev) => prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)))
  }, [])

  return { prompts, loading, addPrompt, updatePrompt, deletePrompt, toggleFavorite }
}
