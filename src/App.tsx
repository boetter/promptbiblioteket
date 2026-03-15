import { useState, useMemo, useCallback, useEffect } from 'react'
import { useAuth } from './contexts/AuthContext'
import { usePrompts } from './hooks/usePrompts'
import { useSearch } from './hooks/useSearch'
import { toSlug } from './lib/slug'
import LoginModal from './components/LoginPage'
import SearchBar from './components/SearchBar'
import TagFilter from './components/TagFilter'
import PromptCard from './components/PromptCard'
import PromptModal from './components/PromptModal'
import AddPromptModal from './components/AddPromptModal'
import CatalogBrowser from './components/CatalogBrowser'
import EmptyState from './components/EmptyState'
import UserMenu from './components/UserMenu'
import Toast from './components/Toast'
import type { Prompt } from './types/prompt'

type Tab = 'mine' | 'katalog'

export default function App() {
  const { user, loading: authLoading } = useAuth()
  const isLoggedIn = !!user
  const { prompts, loading: promptsLoading, addPrompt, updatePrompt, deletePrompt, toggleFavorite } = usePrompts(isLoggedIn)
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>(isLoggedIn ? 'mine' : 'katalog')

  // When user logs in, switch to their collection
  useEffect(() => {
    if (isLoggedIn && activeTab === 'katalog') {
      // Keep on catalog if that's where they were
    }
  }, [isLoggedIn, activeTab])

  // Check for auth error in URL (expired magic link)
  useEffect(() => {
    const urlError = new URLSearchParams(window.location.search).get('error')
    if (urlError) {
      setShowLoginModal(true)
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  const filteredPrompts = useSearch(prompts, query, activeCategory, showFavoritesOnly)

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of prompts) {
      counts[p.category] = (counts[p.category] || 0) + 1
    }
    return counts
  }, [prompts])

  const addedSourceIds = useMemo(() => {
    const ids = new Set<string>()
    for (const p of prompts) {
      ids.add(p.title)
    }
    return ids
  }, [prompts])

  const handleToast = useCallback((message: string) => setToast(message), [])

  const handleTagClick = useCallback((tag: string) => {
    setQuery(tag)
    setActiveTab('mine')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleCatalogAdd = useCallback(
    async (data: { title: string; text: string; tags: string[]; category: string; sourceId: string }) => {
      await addPrompt(data)
    },
    [addPrompt],
  )

  const handleNewPrompt = useCallback(() => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    setShowAddModal(true)
  }, [isLoggedIn])

  const handleTabSwitch = useCallback((tab: Tab) => {
    if (tab === 'mine' && !isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    setActiveTab(tab)
  }, [isLoggedIn])

  // Deep-link
  useEffect(() => {
    const hash = window.location.hash
    const match = hash.match(/^#\/prompt\/(.+)$/)
    if (match && prompts.length > 0) {
      const slug = match[1]
      const found = prompts.find((p) => toSlug(p.title) === slug)
      if (found) setSelectedPrompt(found)
    }
  }, [prompts])

  const openPrompt = useCallback((prompt: Prompt) => {
    setSelectedPrompt(prompt)
    window.history.replaceState(null, '', `#/prompt/${toSlug(prompt.title)}`)
  }, [])

  const closePrompt = useCallback(() => {
    setSelectedPrompt(null)
    window.history.replaceState(null, '', window.location.pathname)
  }, [])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-gray-400 text-lg">Indlæser...</div>
      </div>
    )
  }

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
            {isLoggedIn ? (
              <>
                <UserMenu />
                <button
                  onClick={handleNewPrompt}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1 sm:gap-1.5 whitespace-nowrap"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="sm:hidden">Ny</span>
                  <span className="hidden sm:inline">Ny prompt</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                Log ind
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 border-t border-gray-100 -mb-px">
            <button
              onClick={() => setActiveTab('katalog')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === 'katalog'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Katalog
            </button>
            <button
              onClick={() => handleTabSwitch('mine')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === 'mine'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Min samling
              {isLoggedIn && prompts.length > 0 && (
                <span className="ml-1.5 text-xs opacity-70">{prompts.length}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'katalog' ? (
          <CatalogBrowser
            addedSourceIds={addedSourceIds}
            onAdd={handleCatalogAdd}
            onRequireAuth={() => setShowLoginModal(true)}
            isLoggedIn={isLoggedIn}
            onToast={handleToast}
          />
        ) : promptsLoading ? (
          <div className="text-center py-16">
            <div className="text-gray-400">Henter dine prompts...</div>
          </div>
        ) : prompts.length === 0 ? (
          <EmptyState
            onAdd={handleNewPrompt}
            onBrowseCatalog={() => setActiveTab('katalog')}
          />
        ) : (
          <>
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

            {(query || activeCategory || showFavoritesOnly) && (
              <p className="text-sm text-gray-500 mb-4">
                {filteredPrompts.length}{' '}
                {filteredPrompts.length === 1 ? 'prompt fundet' : 'prompts fundet'}
                {showFavoritesOnly && ' i favoritter'}
                {activeCategory && ` i "${activeCategory}"`}
                {query && ` for "${query}"`}
              </p>
            )}

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
                <p className="text-gray-500">Ingen prompts matcher din søgning.</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
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
