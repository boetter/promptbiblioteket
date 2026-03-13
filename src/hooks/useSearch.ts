import { useMemo } from 'react'
import type { Prompt } from '../types/prompt'

export function useSearch(
  prompts: Prompt[],
  query: string,
  activeCategory: string | null,
  showFavoritesOnly: boolean,
) {
  const results = useMemo(() => {
    let filtered = prompts

    if (showFavoritesOnly) {
      filtered = filtered.filter((p) => p.isFavorite)
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.text.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q),
      )
    }

    if (activeCategory) {
      filtered = filtered.filter((p) => p.category === activeCategory)
    }

    // Sort favorites to top
    filtered = [...filtered].sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1
      if (!a.isFavorite && b.isFavorite) return 1
      return 0
    })

    return filtered
  }, [prompts, query, activeCategory, showFavoritesOnly])

  return results
}
