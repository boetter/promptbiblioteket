import { useState, useEffect } from 'react'
import { CATEGORIES } from '../types/prompt'
import { categorizePrompt, suggestTags } from '../lib/categorize'
import { Dialog, DialogTitle, DialogBody, DialogActions } from './catalyst/dialog'
import { Field, Label } from './catalyst/fieldset'
import { Input } from './catalyst/input'
import { Textarea } from './catalyst/textarea'
import { Button } from './catalyst/button'
import { BadgeButton } from './catalyst/badge'

interface AddPromptModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { title: string; text: string; tags: string[]; category: string }) => void
}

export default function AddPromptModal({ isOpen, onClose, onSave }: AddPromptModalProps) {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [category, setCategory] = useState<string>('Andet')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    if (text.length > 10) {
      const suggested = categorizePrompt(text)
      setCategory(suggested)
      const suggestedTags = suggestTags(text)
      setTags(suggestedTags)
    }
  }, [text])

  useEffect(() => {
    if (!isOpen) {
      setTitle('')
      setText('')
      setCategory('Andet')
      setTagInput('')
      setTags([])
    }
  }, [isOpen])

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = tagInput.trim().toLowerCase()
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag])
      }
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSave = () => {
    if (!title.trim() || !text.trim()) return
    onSave({ title: title.trim(), text: text.trim(), tags, category })
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} size="lg">
      <DialogTitle>Tilføj ny prompt</DialogTitle>

      <DialogBody>
        <div className="space-y-6">
          <Field>
            <Label>Titel</Label>
            <Input
              type="text"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Giv din prompt et kort navn..."
              autoFocus
            />
          </Field>

          <Field>
            <Label>Prompt-tekst</Label>
            <Textarea
              value={text}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
              placeholder="Indsæt din prompt her..."
              rows={6}
            />
          </Field>

          <div>
            <p className="text-base/6 font-medium text-zinc-950 mb-3 sm:text-sm/6 dark:text-white">Kategori</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <BadgeButton
                  key={cat}
                  color={category === cat ? 'indigo' : 'zinc'}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </BadgeButton>
              ))}
            </div>
          </div>

          <Field>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-indigo-500/15 text-indigo-700 px-2 py-0.5 rounded-md text-xs/5 font-medium dark:text-indigo-400"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-indigo-900 cursor-pointer dark:hover:text-indigo-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <Input
              type="text"
              value={tagInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Tilføj tags (tryk Enter)..."
            />
          </Field>
        </div>
      </DialogBody>

      <DialogActions>
        <Button plain onClick={onClose}>
          Annuller
        </Button>
        <Button
          color="indigo"
          onClick={handleSave}
          disabled={!title.trim() || !text.trim()}
        >
          Gem prompt
        </Button>
      </DialogActions>
    </Dialog>
  )
}
