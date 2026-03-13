import { useState, useMemo, useCallback, useEffect } from 'react'
import { usePrompts } from './hooks/usePrompts'
import { useSearch } from './hooks/useSearch'
import { toSlug } from './lib/slug'
import SearchBar from './components/SearchBar'
import TagFilter from './components/TagFilter'
import PromptCard from './components/PromptCard'
import PromptModal from './components/PromptModal'
import AddPromptModal from './components/AddPromptModal'
import EmptyState from './components/EmptyState'
import Toast from './components/Toast'
import type { Prompt } from './types/prompt'

export default function App() {
  const { prompts, addPrompt, updatePrompt, deletePrompt, toggleFavorite, resetAll, restoreDefaults } = usePrompts()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const filteredPrompts = useSearch(prompts, query, activeCategory, showFavoritesOnly)

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of prompts) {
      counts[p.category] = (counts[p.category] || 0) + 1
    }
    return counts
  }, [prompts])

  const handleToast = useCallback((message: string) => {
    setToast(message)
  }, [])

  const handleTagClick = useCallback((tag: string) => {
    setQuery(tag)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  useEffect(() => {
    const hash = window.location.hash
    const match = hash.match(/^#\/prompt\/(.+)$/)
    if (match && prompts.length > 0) {
      const slug = match[1]
      const found = prompts.find((p) => toSlug(p.title) === slug)
      if (found) setSelectedPrompt(found)
    }
  }, [prompts])

  // Deep-link: update URL hash when prompt is opened/closed
  const openPrompt = useCallback((prompt: Prompt) => {
    setSelectedPrompt(prompt)
    window.history.replaceState(null, '', `#/prompt/${toSlug(prompt.title)}`)
  }, [])

  const closePrompt = useCallback(() => {
    setSelectedPrompt(null)
    window.history.replaceState(null, '', window.location.pathname)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="text-2xl shrink-0">📚</span>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight truncate">
              Promptbiblioteket
            </h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {prompts.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Er du sikker? Alle prompts fjernes fra din visning. Du kan altid hente standardprompts tilbage igen.')) {
                    resetAll()
                    handleToast('Alle prompts er fjernet')
                  }
                }}
                className="text-gray-400 hover:text-gray-600 font-medium px-2 sm:px-3 py-2 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                Ryd bibliotek
              </button>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1 sm:gap-1.5 whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tilføj prompt
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {prompts.length === 0 ? (
          <EmptyState
            onAdd={() => setShowAddModal(true)}
            onRestoreDefaults={() => {
              restoreDefaults()
              handleToast('Standardprompts er hentet ind')
            }}
          />
        ) : (
          <>
            {/* Search + Filter */}
            <div className="space-y-4 mb-6">
              <SearchBar query={query} onChange={setQuery} />
              <TagFilter
                activeCategory={activeCategory}
                onSelect={(cat) => {
                  setActiveCategory(cat)
                  setShowFavoritesOnly(false)
                }}
                categoryCounts={categoryCounts}
                showFavoritesOnly={showFavoritesOnly}
                onToggleFavorites={() => {
                  setShowFavoritesOnly((v) => !v)
                  setActiveCategory(null)
                }}
                favoritesCount={prompts.filter((p) => p.isFavorite).length}
              />
            </div>

            {/* Results info */}
            {(query || activeCategory || showFavoritesOnly) && (
              <p className="text-sm text-gray-500 mb-4">
                {filteredPrompts.length}{' '}
                {filteredPrompts.length === 1 ? 'prompt fundet' : 'prompts fundet'}
                {showFavoritesOnly && ' i favoritter'}
                {activeCategory && ` i "${activeCategory}"`}
                {query && ` for "${query}"`}
              </p>
            )}

            {/* Grid */}
            {filteredPrompts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onClick={() => openPrompt(prompt)}
                    onToggleFavorite={() => toggleFavorite(prompt.id)}
                    onTagClick={handleTagClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500">
                  Ingen prompts matcher din søgning.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <AddPromptModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={addPrompt}
      />
      <PromptModal
        prompt={selectedPrompt}
        onClose={closePrompt}
        onDelete={deletePrompt}
        onUpdate={updatePrompt}
        onToggleFavorite={toggleFavorite}
        onTagClick={handleTagClick}
        onToast={handleToast}
      />
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  )
}
