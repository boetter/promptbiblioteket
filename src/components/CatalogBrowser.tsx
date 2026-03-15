import { useState, useMemo, useCallback } from 'react'
import { DEFAULT_PROMPTS } from '../data/defaultPrompts'
import { CATEGORIES, CATEGORY_COLORS } from '../types/prompt'
import SearchBar from './SearchBar'

interface CatalogBrowserProps {
  addedSourceIds: Set<string>
  onAdd: (prompt: { title: string; text: string; tags: string[]; category: string; sourceId: string }) => void
  onRequireAuth?: () => void
  isLoggedIn: boolean
  onToast: (message: string) => void
}

export default function CatalogBrowser({ addedSourceIds, onAdd, onRequireAuth, isLoggedIn, onToast }: CatalogBrowserProps) {
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
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeCategory === null ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Alle
            <span className="ml-1.5 opacity-70">{DEFAULT_PROMPTS.length}</span>
          </button>
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] || 0
            if (count === 0) return null
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : `${CATEGORY_COLORS[cat]} hover:opacity-80`
                }`}
              >
                {cat}
                <span className="ml-1.5 opacity-70">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {query || activeCategory ? (
        <p className="text-sm text-gray-500 mb-4">
          {filtered.length} {filtered.length === 1 ? 'prompt fundet' : 'prompts fundet'}
          {activeCategory && ` i "${activeCategory}"`}
          {query && ` for "${query}"`}
        </p>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const sourceId = p.title
          const isAdded = isLoggedIn && addedSourceIds.has(sourceId)
          return (
            <div
              key={sourceId}
              className="bg-white border border-gray-200 rounded-xl p-5 relative group"
            >
              <div className="flex items-start gap-3 mb-3">
                <span
                  className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${CATEGORY_COLORS[p.category] || CATEGORY_COLORS['Andet']}`}
                >
                  {p.category}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 pr-10 line-clamp-1">{p.title}</h3>

              <p className="text-sm text-gray-500 line-clamp-3 mb-3 leading-relaxed">{p.text}</p>

              {p.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                  {p.tags.length > 3 && (
                    <span className="text-xs text-gray-400">+{p.tags.length - 3}</span>
                  )}
                </div>
              )}

              <button
                onClick={() => handleAdd(p)}
                disabled={isAdded}
                className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all cursor-pointer ${
                  isAdded
                    ? 'bg-green-100 text-green-600'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 opacity-0 group-hover:opacity-100'
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
          <p className="text-gray-500">Ingen prompts matcher din søgning.</p>
        </div>
      )}
    </div>
  )
}
