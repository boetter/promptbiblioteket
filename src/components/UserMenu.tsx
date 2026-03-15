import { useAuth } from '../contexts/AuthContext'
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem } from './catalyst/dropdown'
import { Button } from './catalyst/button'

export default function UserMenu() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <Dropdown>
      <DropdownButton as={Button} plain>
        <span className="text-sm/6 text-zinc-500 truncate max-w-[180px] dark:text-zinc-400">
          {user.email}
        </span>
        <svg data-slot="icon" className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </DropdownButton>
      <DropdownMenu anchor="bottom end">
        <DropdownItem onClick={logout}>
          Log ud
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
