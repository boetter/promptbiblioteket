type AIPlatform = 'chatgpt' | 'claude' | 'gemini'

export async function openInPlatform(
  platform: AIPlatform,
  promptText: string,
): Promise<{ copied: boolean }> {
  const encoded = encodeURIComponent(promptText)

  switch (platform) {
    case 'chatgpt': {
      window.open(`https://chatgpt.com/?q=${encoded}`, '_blank')
      return { copied: false }
    }
    case 'claude': {
      await navigator.clipboard.writeText(promptText)
      window.open('https://claude.ai/new', '_blank')
      return { copied: true }
    }
    case 'gemini': {
      await navigator.clipboard.writeText(promptText)
      window.open('https://gemini.google.com/app', '_blank')
      return { copied: true }
    }
  }
}

export const PLATFORM_INFO: Record<
  AIPlatform,
  { name: string; color: string; icon: string }
> = {
  chatgpt: { name: 'ChatGPT', color: 'bg-[#10a37f] hover:bg-[#0d8c6d]', icon: '↗' },
  claude: { name: 'Claude', color: 'bg-[#d97706] hover:bg-[#b45309]', icon: '↗' },
  gemini: { name: 'Gemini', color: 'bg-[#4285f4] hover:bg-[#3367d6]', icon: '↗' },
}
