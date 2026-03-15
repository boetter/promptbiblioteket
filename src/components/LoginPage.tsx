import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Dialog, DialogTitle, DialogDescription, DialogBody, DialogActions } from './catalyst/dialog'
import { Field, Label } from './catalyst/fieldset'
import { Input } from './catalyst/input'
import { Button } from './catalyst/button'
import { Text } from './catalyst/text'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setError('')

    try {
      await login(email.trim())
      setSent(true)
    } catch {
      setError('Kunne ikke sende login-link. Prøv igen.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSent(false)
    setEmail('')
    setError('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} size="sm">
      <DialogTitle>Log ind for at gemme</DialogTitle>
      <DialogDescription>
        Opret din gratis konto for at gemme prompts i din egen samling. Vi sender et login-link til din email.
      </DialogDescription>

      <DialogBody>
        {sent ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">✉️</div>
            <p className="text-base/6 font-semibold text-zinc-950 mb-2 dark:text-white">Tjek din indbakke</p>
            <Text>
              Vi har sendt et login-link til <strong className="font-medium text-zinc-950 dark:text-white">{email}</strong>. Klik på linket for at logge ind.
            </Text>
            <button
              onClick={() => { setSent(false); setEmail('') }}
              className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
            >
              Prøv en anden email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Field>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="din@email.dk"
                autoFocus
                required
              />
            </Field>

            {error && (
              <p className="text-sm text-red-600 mt-3 dark:text-red-500">{error}</p>
            )}

            <DialogActions>
              <Button plain onClick={handleClose}>
                Annuller
              </Button>
              <Button
                type="submit"
                color="indigo"
                disabled={loading || !email.trim()}
              >
                {loading ? 'Sender...' : 'Send login-link'}
              </Button>
            </DialogActions>
          </form>
        )}
      </DialogBody>
    </Dialog>
  )
}
