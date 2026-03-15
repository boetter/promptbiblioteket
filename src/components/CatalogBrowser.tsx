import { useState, useMemo, useCallback } from 'react'
import { DEFAULT_PROMPTS } from '../data/defaultPrompts'
import { CATEGORIES } from '../types/prompt'
import SearchBar from './SearchBar'
import { Badge, BadgeButton } from './catalyst/badge'
import { Text } from './catalyst/text'

const CATEGORY_BADGE_COLORS: Record<string, 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'cyan' | 'zinc' | 'lime' | 'teal' | 'pink' | 'indigo' | 'violet' | 'orange' | 'sky'> = {
  Skrivning: 'blue',
  Kodning: 'emerald',
  Analyse: 'amber',
  Kreativitet: 'purple',
  Læring: 'rose',
  Strategi: 'cyan',
  Ledelse: 'zinc',
  Økonomi: 'lime',
  HR: 'teal',
  Marketing: 'pink',
  Jura: 'indigo',
  Tech: 'violet',
  Projektledelse: 'orange',
  Andet: 'zinc',
}

interface CatalogBrowserProps {
  addedSourceIds: Set<string>
  onAdd: (prompt: { title: string; text: string; tags: string[]; category: string; sourceId: string }) => void
  onRequireAuth?: () => void
  isLoggedIn: boolean
  onToast: (message: string) => void
  onView: (prompt: { title: string; text: string; tags: string[]; category: string }) => void
}

export default function CatalogBrowser({ addedSourceIds, onAdd, onRequireAuth, isLoggedIn, onToast, onView }: CatalogBrowserProps) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let results = DEFAULT_PROMPTS

    if (query.trim()) {
      const q = query.trim().toLowerCase()
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.text.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q),
      )
    }

    if (activeCategory) {
      results = results.filter((p) => p.category === activeCategory)
    }

    return results
  }, [query, activeCategory])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of DEFAULT_PROMPTS) {
      counts[p.category] = (counts[p.category] || 0) + 1
    }
    return counts
  }, [])

  const handleAdd = useCallback(
    (p: (typeof DEFAULT_PROMPTS)[number]) => {
      if (!isLoggedIn) {
        onRequireAuth?.()
        return
      }
      const sourceId = p.title
      if (addedSourceIds.has(sourceId)) return
      onAdd({ title: p.title, text: p.text, tags: p.tags, category: p.category, sourceId })
      onToast(`"${p.title}" tilføjet til din samling`)
    },
    [isLoggedIn, addedSourceIds, onAdd, onRequireAuth, onToast],
  )

  return (
    <div>
      <div className="space-y-4 mb-6">
        <SearchBar query={query} onChange={setQuery} placeholder="Søg i kataloget..." />

        <div className="flex flex-wrap gap-2">
          <BadgeButton
            color={activeCategory === null ? 'indigo' : 'zinc'}
            onClick={() => setActiveCategory(null)}
          >
            Alle {DEFAULT_PROMPTS.length}
          </BadgeButton>
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] || 0
            if (count === 0) return null
            return (
              <BadgeButton
                key={cat}
                color={activeCategory === cat ? 'indigo' : (CATEGORY_BADGE_COLORS[cat] || 'zinc')}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              >
                {cat} {count}
              </BadgeButton>
            )
          })}
        </div>
      </div>

      {(query || activeCategory) && (
        <Text className="mb-4">
          {filtered.length} {filtered.length === 1 ? 'prompt fundet' : 'prompts fundet'}
          {activeCategory && ` i "${activeCategory}"`}
          {query && ` for "${query}"`}
        </Text>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const sourceId = p.title
          const isAdded = isLoggedIn && addedSourceIds.has(sourceId)
          return (
            <div
              key={sourceId}
              onClick={() => onView(p)}
              className="rounded-lg bg-white p-5 shadow-xs ring-1 ring-zinc-950/5 relative group cursor-pointer hover:shadow-sm hover:ring-zinc-950/10 transition-all dark:bg-zinc-900 dark:ring-white/10"
            >
              <div className="mb-3">
                <Badge color={CATEGORY_BADGE_COLORS[p.category] || 'zinc'}>
                  {p.category}
                </Badge>
              </div>

              <h3 className="font-semibold text-zinc-950 mb-2 pr-10 line-clamp-1 text-base/6 sm:text-sm/6 dark:text-white">
                {p.title}
              </h3>

              <p className="text-sm/6 text-zinc-500 line-clamp-3 mb-3 dark:text-zinc-400">{p.text}</p>

              {p.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-zinc-500 px-2 py-0.5 rounded-md bg-zinc-950/5 dark:bg-white/5 dark:text-zinc-400"
                    >
                      #{tag}
                    </span>
                  ))}
                  {p.tags.length > 3 && (
                    <span className="text-xs text-zinc-400">+{p.tags.length - 3}</span>
                  )}
                </div>
              )}

              <button
                onClick={(e) => { e.stopPropagation(); handleAdd(p) }}
                disabled={isAdded}
                className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all cursor-pointer ${
                  isAdded
                    ? 'bg-green-500/15 text-green-700 dark:text-green-400'
                    : 'bg-indigo-500/15 text-indigo-700 hover:bg-indigo-500/25 opacity-0 group-hover:opacity-100 dark:text-indigo-400'
                }`}
                title={isAdded ? 'Allerede tilføjet' : 'Tilføj til min samling'}
              >
                {isAdded ? '✓' : '+'}
              </button>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Text>Ingen prompts matcher din søgning.</Text>
        </div>
      )}
    </div>
  )
}
