import { useState } from 'react'
import type { Prompt } from '../types/prompt'
import { CATEGORY_COLORS } from '../types/prompt'
import { openInPlatform, PLATFORM_INFO } from '../lib/openIn'

interface PromptModalProps {
  prompt: Prompt | null
  onClose: () => void
  onDelete: (id: string) => void
  onToggleFavorite: (id: string) => void
  onToast: (message: string) => void
}

export default function PromptModal({
  prompt,
  onClose,
  onDelete,
  onToggleFavorite,
  onToast,
}: PromptModalProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!prompt) return null

  const handleOpenIn = async (platform: 'chatgpt' | 'claude' | 'gemini') => {
    const result = await openInPlatform(platform, prompt.text)
    if (result.copied) {
      onToast('Prompt kopieret! Indsæt den i chatten.')
    }
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

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span
                className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${CATEGORY_COLORS[prompt.category] || CATEGORY_COLORS['Andet']}`}
              >
                {prompt.category}
              </span>
              <button
                onClick={() => onToggleFavorite(prompt.id)}
                className="text-lg cursor-pointer"
                title={prompt.isFavorite ? 'Fjern fra favoritter' : 'Tilføj til favoritter'}
              >
                {prompt.isFavorite ? '★' : '☆'}
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">{prompt.title}</h2>

          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
              {prompt.text}
            </pre>
          </div>

          {prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {prompt.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Åbn i
            </p>
            <div className="flex gap-2">
              {(Object.entries(PLATFORM_INFO) as [string, { name: string; color: string; icon: string }][]).map(
                ([key, info]) => (
                  <button
                    key={key}
                    onClick={() => handleOpenIn(key as 'chatgpt' | 'claude' | 'gemini')}
                    className={`flex items-center gap-2 px-4 py-2.5 ${info.color} text-white rounded-xl text-sm font-medium transition-colors cursor-pointer`}
                  >
                    {info.name}
                    <span className="text-xs opacity-80">{info.icon}</span>
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Kopiér prompt
            </button>
            <div className="flex-1" />
            <button
              onClick={handleDelete}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                confirmDelete
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'text-red-500 hover:bg-red-50'
              }`}
            >
              {confirmDelete ? 'Bekræft sletning' : 'Slet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
