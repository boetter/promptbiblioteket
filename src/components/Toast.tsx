import { useEffect } from 'react'

interface ToastProps {
  message: string | null
  onClose: () => void
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [message, onClose])

  if (!message) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-[slideUp_0.3s_ease-out]">
      <div className="bg-zinc-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm/6 font-medium dark:bg-zinc-700">
        {message}
      </div>
    </div>
  )
}
