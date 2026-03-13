import { useState, useEffect } from 'react'
import type { Prompt } from '../types/prompt'
import { CATEGORIES, CATEGORY_COLORS } from '../types/prompt'
import { openInPlatform, PLATFORM_INFO } from '../lib/openIn'

interface PromptModalProps {
  prompt: Prompt | null
  onClose: () => void
  onDelete: (id: string) => void
  onUpdate: (id: string, data: Partial<Pick<Prompt, 'title' | 'text' | 'tags' | 'category'>>) => void
  onToggleFavorite: (id: string) => void
  onToast: (message: string) => void
}

export default function PromptModal({
  prompt,
  onClose,
  onDelete,
  onUpdate,
  onToggleFavorite,
  onToast,
}: PromptModalProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editText, setEditText] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editTags, setEditTags] = useState<string[]>([])
  const [editTagInput, setEditTagInput] = useState('')

  useEffect(() => {
    if (prompt) {
      setEditTitle(prompt.title)
      setEditText(prompt.text)
      setEditCategory(prompt.category)
      setEditTags([...prompt.tags])
      setIsEditing(false)
      setConfirmDelete(false)
      setEditTagInput('')
    }
  }, [prompt])

  if (!prompt) return null

  const handleOpenIn = async (platform: 'chatgpt' | 'claude' | 'mistral') => {
    await openInPlatform(platform, prompt.text)
  }

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    onDelete(prompt.id)
    onClose()
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.text)
    onToast('Prompt kopieret til udklipsholder!')
  }

  const handleSaveEdit = () => {
    if (!editTitle.trim() || !editText.trim()) return
    onUpdate(prompt.id, {
      title: editTitle.trim(),
      text: editText.trim(),
      category: editCategory,
      tags: editTags,
    })
    setIsEditing(false)
    onToast('Prompt opdateret!')
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = editTagInput.trim().toLowerCase()
      if (tag && !editTags.includes(tag)) {
        setEditTags([...editTags, tag])
      }
      setEditTagInput('')
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-5">
          {/* Header: metadata row + close */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setEditCategory(cat)}
                      className={`px-2 py-0.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                        editCategory === cat
                          ? 'bg-indigo-600 text-white'
                          : `${CATEGORY_COLORS[cat]} hover:opacity-80`
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${CATEGORY_COLORS[prompt.category] || CATEGORY_COLORS['Andet']}`}
                  >
                    {prompt.category}
                  </span>
                  <button
                    onClick={() => onToggleFavorite(prompt.id)}
                    className={`text-base cursor-pointer ${prompt.isFavorite ? 'text-amber-500' : 'text-gray-300 hover:text-amber-400'}`}
                    title={prompt.isFavorite ? 'Fjern fra favoritter' : 'Tilføj til favoritter'}
                  >
                    {prompt.isFavorite ? '★' : '☆'}
                  </button>
                </>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Title */}
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full text-lg font-semibold text-gray-900 mb-3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              autoFocus
            />
          ) : (
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{prompt.title}</h2>
          )}

          {/* Prompt text – the main focus */}
          {isEditing ? (
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={8}
              className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y mb-2"
            />
          ) : (
            <div className="bg-gray-50/80 rounded-xl px-4 py-3 mb-2">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                {prompt.text}
              </pre>
            </div>
          )}

          {/* Tags – tight to prompt */}
          {isEditing ? (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {editTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-xs font-medium"
                  >
                    #{tag}
                    <button
                      onClick={() => setEditTags(editTags.filter((t) => t !== tag))}
                      className="hover:text-indigo-900 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={editTagInput}
                onChange={(e) => setEditTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Tilføj tags (tryk Enter)..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          ) : (
            prompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {prompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )
          )}

          {/* Platform buttons – visually secondary */}
          {!isEditing && (
            <div className="mb-3">
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-2">
                Åbn i
              </p>
              <div className="flex gap-2">
                {(Object.entries(PLATFORM_INFO) as [string, { name: string; color: string; icon: string }][]).map(
                  ([key, info]) => (
                    <button
                      key={key}
                      onClick={() => handleOpenIn(key as 'chatgpt' | 'claude' | 'mistral')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 ${info.color} text-white rounded-lg text-xs font-medium transition-colors cursor-pointer`}
                    >
                      {info.name}
                      <span className="opacity-70">{info.icon}</span>
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          {/* Action bar */}
          <div className="flex items-center pt-3 border-t border-gray-100">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  disabled={!editTitle.trim() || !editText.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Gem ændringer
                </button>
                <button
                  onClick={() => {
                    setEditTitle(prompt.title)
                    setEditText(prompt.text)
                    setEditCategory(prompt.category)
                    setEditTags([...prompt.tags])
                    setIsEditing(false)
                  }}
                  className="ml-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Annuller
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Kopiér prompt
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="ml-2 px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                >
                  Rediger
                </button>
                <div className="flex-1" />
                <button
                  onClick={handleDelete}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    confirmDelete
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'text-red-400 hover:bg-red-50 hover:text-red-500'
                  }`}
                >
                  {confirmDelete ? 'Bekræft sletning' : 'Slet'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
