import { CATEGORIES } from '../types/prompt'
import { BadgeButton } from './catalyst/badge'

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
      <BadgeButton
        color={activeCategory === null && !showFavoritesOnly ? 'indigo' : 'zinc'}
        onClick={() => onSelect(null)}
      >
        Alle
      </BadgeButton>
      {favoritesCount > 0 && (
        <BadgeButton
          color={showFavoritesOnly ? 'amber' : 'zinc'}
          onClick={onToggleFavorites}
        >
          ★ Favoritter {favoritesCount}
        </BadgeButton>
      )}
      {CATEGORIES.map((cat) => {
        const count = categoryCounts[cat] || 0
        if (count === 0) return null
        const isActive = activeCategory === cat
        return (
          <BadgeButton
            key={cat}
            color={isActive ? 'indigo' : (CATEGORY_BADGE_COLORS[cat] || 'zinc')}
            onClick={() => onSelect(isActive ? null : cat)}
          >
            {cat} {count}
          </BadgeButton>
        )
      })}
    </div>
  )
}
