import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Check for error in URL (e.g., invalid/expired token)
  const urlError = new URLSearchParams(window.location.search).get('error')

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

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-5xl block mb-4">📚</span>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Promptbiblioteket
          </h1>
          <p className="text-gray-500 mt-2">
            Din personlige samling af AI-prompts
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">✉️</div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Tjek din indbakke</h2>
              <p className="text-gray-500 text-sm">
                Vi har sendt et login-link til <strong>{email}</strong>. Klik på linket for at logge ind.
              </p>
              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
              >
                Prøv en anden email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@email.dk"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                autoFocus
                required
              />

              {(error || urlError) && (
                <p className="text-red-500 text-sm mt-2">
                  {error || (urlError === 'invalid_token' ? 'Login-linket er ugyldigt eller udløbet. Prøv igen.' : 'Der opstod en fejl.')}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full mt-4 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Sender...' : 'Send login-link'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
