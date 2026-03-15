import type { Prompt } from '../types/prompt'
import { Badge } from './catalyst/badge'

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

interface PromptCardProps {
  prompt: Prompt
  onClick: () => void
  onToggleFavorite: () => void
  onTagClick: (tag: string) => void
}

export default function PromptCard({ prompt, onClick, onToggleFavorite, onTagClick }: PromptCardProps) {
  return (
    <div
      onClick={onClick}
      className="rounded-lg bg-white p-5 shadow-xs ring-1 ring-zinc-950/5 cursor-pointer hover:shadow-sm hover:ring-zinc-950/10 transition-all group relative dark:bg-zinc-900 dark:ring-white/10"
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite()
        }}
        className={`absolute top-4 right-4 text-lg transition-opacity cursor-pointer ${
          prompt.isFavorite ? 'text-amber-500 opacity-100' : 'opacity-0 group-hover:opacity-100 text-zinc-400'
        }`}
        title={prompt.isFavorite ? 'Fjern fra favoritter' : 'Tilføj til favoritter'}
      >
        {prompt.isFavorite ? '★' : '☆'}
      </button>

      <div className="mb-3">
        <Badge color={CATEGORY_BADGE_COLORS[prompt.category] || 'zinc'}>
          {prompt.category}
        </Badge>
      </div>

      <h3 className="font-semibold text-zinc-950 mb-2 pr-6 line-clamp-1 text-base/6 sm:text-sm/6 dark:text-white">
        {prompt.title}
      </h3>

      <p className="text-sm/6 text-zinc-500 line-clamp-3 mb-3 dark:text-zinc-400">
        {prompt.text}
      </p>

      {prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {prompt.tags.slice(0, 3).map((tag) => (
            <button
              key={tag}
              onClick={(e) => {
                e.stopPropagation()
                onTagClick(tag)
              }}
              className="text-xs text-zinc-500 px-2 py-0.5 rounded-md bg-zinc-950/5 hover:bg-indigo-500/10 hover:text-indigo-600 transition-colors cursor-pointer dark:bg-white/5 dark:text-zinc-400"
            >
              #{tag}
            </button>
          ))}
          {prompt.tags.length > 3 && (
            <span className="text-xs text-zinc-400">+{prompt.tags.length - 3}</span>
          )}
        </div>
      )}
    </div>
  )
}
