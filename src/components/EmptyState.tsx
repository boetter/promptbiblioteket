import { Heading } from './catalyst/heading'
import { Text } from './catalyst/text'
import { Button } from './catalyst/button'

interface EmptyStateProps {
  onAdd: () => void
  onBrowseCatalog: () => void
}

export default function EmptyState({ onAdd, onBrowseCatalog }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="text-6xl mb-6">📚</div>
      <Heading level={2}>Velkommen til dit promptbibliotek</Heading>
      <Text className="mt-2 mb-8 text-center max-w-md">
        Start med at skrive din egen prompt eller udforsk vores katalog med over 1.000 færdige prompts.
      </Text>
      <div className="flex gap-3">
        <Button color="indigo" onClick={onBrowseCatalog}>
          Udforsk kataloget
        </Button>
        <Button outline onClick={onAdd}>
          + Skriv din egen
        </Button>
      </div>
    </div>
  )
}
