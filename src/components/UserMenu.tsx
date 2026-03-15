import { useAuth } from '../contexts/AuthContext'

export default function UserMenu() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 hidden sm:inline truncate max-w-[180px]">
        {user.email}
      </span>
      <button
        onClick={logout}
        className="text-gray-400 hover:text-gray-600 font-medium px-2 sm:px-3 py-2 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
      >
        Log ud
      </button>
    </div>
  )
}
