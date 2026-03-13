import { useMemo } from 'react'
import Fuse from 'fuse.js'
import type { Prompt } from '../types/prompt'

export function useSearch(prompts: Prompt[], query: string, activeCategory: string | null) {
  const fuse = useMemo(
    () =>
      new Fuse(prompts, {
        keys: [
          { name: 'title', weight: 2 },
          { name: 'text', weight: 1 },
          { name: 'tags', weight: 1.5 },
          { name: 'category', weight: 1 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [prompts],
  )

  const results = useMemo(() => {
    let filtered = prompts

    if (query.trim()) {
      filtered = fuse.search(query).map((r) => r.item)
    }

    if (activeCategory) {
      filtered = filtered.filter((p) => p.category === activeCategory)
    }

    return filtered
  }, [prompts, query, activeCategory, fuse])

  return results
}
