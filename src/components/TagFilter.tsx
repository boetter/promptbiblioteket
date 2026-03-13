import { CATEGORIES, CATEGORY_COLORS } from '../types/prompt'

interface TagFilterProps {
  activeCategory: string | null
  onSelect: (category: string | null) => void
  categoryCounts: Record<string, number>
  showFavoritesOnly: boolean
  onToggleFavorites: () => void
  favoritesCount: number
}

export default function TagFilter({
  activeCategory,
  onSelect,
  categoryCounts,
  showFavoritesOnly,
  onToggleFavorites,
  favoritesCount,
}: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
          activeCategory === null && !showFavoritesOnly
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Alle
      </button>
      {favoritesCount > 0 && (
        <button
          onClick={onToggleFavorites}
          className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            showFavoritesOnly
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
          }`}
        >
          ★ Favoritter
          <span className="ml-1.5 opacity-70">{favoritesCount}</span>
        </button>
      )}
      {CATEGORIES.map((cat) => {
        const count = categoryCounts[cat] || 0
        if (count === 0) return null
        const isActive = activeCategory === cat
        return (
          <button
            key={cat}
            onClick={() => onSelect(isActive ? null : cat)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              isActive
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
  )
}
