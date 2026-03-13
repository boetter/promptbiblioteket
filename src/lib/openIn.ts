type AIPlatform = 'chatgpt' | 'claude' | 'mistral'

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
      window.open(`https://claude.ai/new?q=${encoded}`, '_blank')
      return { copied: false }
    }
    case 'mistral': {
      window.open(`https://chat.mistral.ai/chat?q=${encoded}`, '_blank')
      return { copied: false }
    }
  }
}

export const PLATFORM_INFO: Record<
  AIPlatform,
  { name: string; color: string; icon: string }
> = {
  chatgpt: { name: 'ChatGPT', color: 'bg-[#10a37f] hover:bg-[#0d8c6d]', icon: '↗' },
  claude: { name: 'Claude', color: 'bg-[#d97706] hover:bg-[#b45309]', icon: '↗' },
  mistral: { name: 'Mistral', color: 'bg-[#f97316] hover:bg-[#ea580c]', icon: '↗' },
}
