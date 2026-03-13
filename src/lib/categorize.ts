import type { Category } from '../types/prompt'

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  Skrivning: [
    'skriv', 'tekst', 'artikel', 'blog', 'historie', 'fortælling', 'essay',
    'oversæt', 'translate', 'write', 'copywriting', 'indhold', 'content',
    'brev', 'mail', 'besked', 'formuler', 'omskriv', 'rewrite',
  ],
  Kodning: [
    'kode', 'kod', 'programmér', 'funktion', 'bug', 'debug', 'javascript',
    'python', 'api', 'code', 'program', 'script', 'html', 'css', 'react',
    'database', 'sql', 'typescript', 'fejl', 'error', 'fix',
  ],
  Analyse: [
    'analysér', 'analyse', 'data', 'rapport', 'sammenlign', 'evaluer',
    'vurder', 'analyze', 'research', 'undersøg', 'statistik', 'tal',
    'måling', 'benchmark', 'review',
  ],
  Kreativitet: [
    'idé', 'brainstorm', 'kreativ', 'design', 'koncept', 'creative',
    'opfind', 'forestil', 'imagine', 'kunst', 'kunst', 'innovation',
    'inspiration', 'visuel',
  ],
  Læring: [
    'forklar', 'lær', 'forstå', 'hvordan', 'hvad er', 'definer', 'explain',
    'learn', 'understand', 'tutorial', 'guide', 'trin', 'step', 'begynder',
    'introduktion', 'grundlæggende',
  ],
  Arbejde: [
    'email', 'møde', 'præsentation', 'strategi', 'plan', 'projekt',
    'meeting', 'agenda', 'business', 'kunde', 'salg', 'marketing',
    'produktivitet', 'workflow', 'proces',
  ],
  Andet: [],
}

export function categorizePrompt(text: string): Category {
  const lower = text.toLowerCase()
  let bestCategory: Category = 'Andet'
  let bestScore = 0

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === 'Andet') continue
    const score = keywords.filter((kw) => lower.includes(kw)).length
    if (score > bestScore) {
      bestScore = score
      bestCategory = category as Category
    }
  }

  return bestCategory
}

export function suggestTags(text: string): string[] {
  const lower = text.toLowerCase()
  const tags: string[] = []

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === 'Andet') continue
    const matches = keywords.filter((kw) => lower.includes(kw))
    if (matches.length > 0) {
      tags.push(category.toLowerCase())
    }
  }

  return tags.length > 0 ? tags : ['andet']
}
