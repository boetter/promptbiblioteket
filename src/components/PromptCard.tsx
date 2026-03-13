import type { Prompt } from '../types/prompt'
import { CATEGORY_COLORS } from '../types/prompt'

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
      className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all group relative"
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite()
        }}
        className={`absolute top-4 right-4 text-lg transition-opacity cursor-pointer ${
          prompt.isFavorite ? 'text-amber-500 opacity-100' : 'opacity-0 group-hover:opacity-100 text-gray-400'
        }`}
        title={prompt.isFavorite ? 'Fjern fra favoritter' : 'Tilføj til favoritter'}
      >
        {prompt.isFavorite ? '★' : '☆'}
      </button>

      <div className="flex items-start gap-3 mb-3">
        <span
          className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${CATEGORY_COLORS[prompt.category] || CATEGORY_COLORS['Andet']}`}
        >
          {prompt.category}
        </span>
        {prompt.isFavorite && (
          <span className="text-amber-500 text-sm">★</span>
        )}
      </div>

      <h3 className="font-semibold text-gray-900 mb-2 pr-6 line-clamp-1">
        {prompt.title}
      </h3>

      <p className="text-sm text-gray-500 line-clamp-3 mb-3 leading-relaxed">
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
              className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              #{tag}
            </button>
          ))}
          {prompt.tags.length > 3 && (
            <span className="text-xs text-gray-400">+{prompt.tags.length - 3}</span>
          )}
        </div>
      )}
    </div>
  )
}
