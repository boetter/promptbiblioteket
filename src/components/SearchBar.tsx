import { Input, InputGroup } from './catalyst/input'

interface SearchBarProps {
  query: string
  onChange: (query: string) => void
  placeholder?: string
}

export default function SearchBar({ query, onChange, placeholder = 'Søg i dine prompts...' }: SearchBarProps) {
  return (
    <div className="max-w-xl">
      <InputGroup>
        <svg data-slot="icon" className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <Input
          type="search"
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </InputGroup>
    </div>
  )
}
