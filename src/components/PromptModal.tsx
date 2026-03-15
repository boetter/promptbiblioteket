import { useState, useEffect } from 'react'
import type { Prompt } from '../types/prompt'
import { CATEGORIES } from '../types/prompt'
import { openInPlatform, PLATFORM_INFO } from '../lib/openIn'
import { Dialog, DialogTitle, DialogBody, DialogActions } from './catalyst/dialog'
import { Field } from './catalyst/fieldset'
import { Input } from './catalyst/input'
import { Textarea } from './catalyst/textarea'
import { Button } from './catalyst/button'
import { Badge, BadgeButton } from './catalyst/badge'
import { Text } from './catalyst/text'
import { Divider } from './catalyst/divider'

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

interface PromptModalProps {
  prompt: Prompt | null
  onClose: () => void
  onDelete: (id: string) => void
  onUpdate: (id: string, data: Partial<Pick<Prompt, 'title' | 'text' | 'tags' | 'category'>>) => void
  onToggleFavorite: (id: string) => void
  onTagClick: (tag: string) => void
  onToast: (message: string) => void
  readOnly?: boolean
  onAddToCollection?: () => void
}

export default function PromptModal({
  prompt,
  onClose,
  onDelete,
  onUpdate,
  onToggleFavorite,
  onTagClick,
  onToast,
  readOnly = false,
  onAddToCollection,
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
    <Dialog open={!!prompt} onClose={onClose} size="2xl">
      {/* Header: category + favorite */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <BadgeButton
                  key={cat}
                  color={editCategory === cat ? 'indigo' : 'zinc'}
                  onClick={() => setEditCategory(cat)}
                >
                  {cat}
                </BadgeButton>
              ))}
            </div>
          ) : (
            <>
              <Badge color={CATEGORY_BADGE_COLORS[prompt.category] || 'zinc'}>
                {prompt.category}
              </Badge>
              {!readOnly && (
                <button
                  onClick={() => onToggleFavorite(prompt.id)}
                  className={`text-base cursor-pointer ${prompt.isFavorite ? 'text-amber-500' : 'text-zinc-300 hover:text-amber-400 dark:text-zinc-600'}`}
                >
                  {prompt.isFavorite ? '★' : '☆'}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Title */}
      {isEditing ? (
        <Field>
          <Input
            type="text"
            value={editTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTitle(e.target.value)}
            autoFocus
          />
        </Field>
      ) : (
        <DialogTitle className="mt-1">{prompt.title}</DialogTitle>
      )}

      <DialogBody>
        {/* Prompt text */}
        {isEditing ? (
          <Textarea
            value={editText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditText(e.target.value)}
            rows={8}
          />
        ) : (
          <div className="rounded-lg bg-zinc-950/2.5 px-4 py-3 dark:bg-white/5">
            <pre className="text-sm/6 text-zinc-700 whitespace-pre-wrap font-sans dark:text-zinc-300">
              {prompt.text}
            </pre>
          </div>
        )}

        {/* Tags */}
        {isEditing ? (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {editTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-indigo-500/15 text-indigo-700 px-2 py-0.5 rounded-md text-xs/5 font-medium dark:text-indigo-400"
                >
                  #{tag}
                  <button
                    onClick={() => setEditTags(editTags.filter((t) => t !== tag))}
                    className="hover:text-indigo-900 cursor-pointer dark:hover:text-indigo-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <Input
              type="text"
              value={editTagInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Tilføj tags (tryk Enter)..."
            />
          </div>
        ) : (
          prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {prompt.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    onTagClick(tag)
                    onClose()
                  }}
                  className="text-xs bg-zinc-950/5 text-zinc-500 px-2 py-0.5 rounded-md hover:bg-indigo-500/10 hover:text-indigo-600 transition-colors cursor-pointer dark:bg-white/5 dark:text-zinc-400"
                >
                  #{tag}
                </button>
              ))}
            </div>
          )
        )}

        {/* Platform buttons */}
        {!isEditing && (
          <div className="mt-4">
            <Divider soft />
            <Text className="mt-3 mb-2 text-xs font-medium uppercase tracking-wide">Åbn i</Text>
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
      </DialogBody>

      {/* Actions */}
      <DialogActions>
        {isEditing ? (
          <>
            <Button plain onClick={() => {
              setEditTitle(prompt.title)
              setEditText(prompt.text)
              setEditCategory(prompt.category)
              setEditTags([...prompt.tags])
              setIsEditing(false)
            }}>
              Annuller
            </Button>
            <Button
              color="indigo"
              onClick={handleSaveEdit}
              disabled={!editTitle.trim() || !editText.trim()}
            >
              Gem ændringer
            </Button>
          </>
        ) : readOnly ? (
          <>
            {onAddToCollection && (
              <Button color="indigo" onClick={onAddToCollection}>
                <svg data-slot="icon" className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tilføj til samling
              </Button>
            )}
            <div className="flex-1" />
            <Button outline onClick={handleCopy}>
              Kopiér prompt
            </Button>
          </>
        ) : (
          <>
            {confirmDelete ? (
              <Button color="red" onClick={handleDelete}>
                Bekræft sletning
              </Button>
            ) : (
              <Button plain onClick={handleDelete}>
                Slet
              </Button>
            )}
            <div className="flex-1" />
            <Button plain onClick={() => setIsEditing(true)}>
              Rediger
            </Button>
            <Button outline onClick={handleCopy}>
              Kopiér prompt
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}
