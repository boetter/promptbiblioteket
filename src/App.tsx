import { useState, useMemo, useCallback } from 'react'
import { usePrompts } from './hooks/usePrompts'
import { useSearch } from './hooks/useSearch'
import SearchBar from './components/SearchBar'
import TagFilter from './components/TagFilter'
import PromptCard from './components/PromptCard'
import PromptModal from './components/PromptModal'
import AddPromptModal from './components/AddPromptModal'
import EmptyState from './components/EmptyState'
import Toast from './components/Toast'
import type { Prompt } from './types/prompt'

export default function App() {
  const { prompts, addPrompt, deletePrompt, toggleFavorite, resetAll, restoreDefaults } = usePrompts()
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

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
              Promptbiblioteket
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {prompts.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Er du sikker? Alle prompts fjernes fra din visning. Du kan altid hente standardprompts tilbage igen.')) {
                    resetAll()
                    handleToast('Alle prompts er fjernet')
                  }
                }}
                className="text-gray-400 hover:text-gray-600 font-medium px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer"
              >
                Ryd bibliotek
              </button>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors cursor-pointer flex items-center gap-1.5"
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
                onSelect={setActiveCategory}
                categoryCounts={categoryCounts}
                showFavoritesOnly={showFavoritesOnly}
                onToggleFavorites={() => setShowFavoritesOnly((v) => !v)}
                favoritesCount={prompts.filter((p) => p.isFavorite).length}
              />
            </div>

            {/* Results info */}
            {(query || activeCategory) && (
              <p className="text-sm text-gray-500 mb-4">
                {filteredPrompts.length}{' '}
                {filteredPrompts.length === 1 ? 'prompt fundet' : 'prompts fundet'}
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
                    onClick={() => setSelectedPrompt(prompt)}
                    onToggleFavorite={() => toggleFavorite(prompt.id)}
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
        onClose={() => setSelectedPrompt(null)}
        onDelete={deletePrompt}
        onToggleFavorite={toggleFavorite}
        onToast={handleToast}
      />
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  )
}
