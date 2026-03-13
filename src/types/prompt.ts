export interface Prompt {
  id: string
  title: string
  text: string
  tags: string[]
  category: string
  createdAt: string
  updatedAt: string
  isFavorite: boolean
}

export const CATEGORIES = [
  'Skrivning',
  'Kodning',
  'Analyse',
  'Kreativitet',
  'Læring',
  'Arbejde',
  'HR',
  'Marketing',
  'Jura',
  'Tech',
  'Projektledelse',
  'Andet',
] as const

export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_COLORS: Record<string, string> = {
  Skrivning: 'bg-blue-100 text-blue-700',
  Kodning: 'bg-emerald-100 text-emerald-700',
  Analyse: 'bg-amber-100 text-amber-700',
  Kreativitet: 'bg-purple-100 text-purple-700',
  Læring: 'bg-rose-100 text-rose-700',
  Arbejde: 'bg-slate-100 text-slate-700',
  HR: 'bg-teal-100 text-teal-700',
  Marketing: 'bg-pink-100 text-pink-700',
  Jura: 'bg-indigo-100 text-indigo-700',
  Tech: 'bg-violet-100 text-violet-700',
  Projektledelse: 'bg-orange-100 text-orange-700',
  Andet: 'bg-gray-100 text-gray-600',
}
