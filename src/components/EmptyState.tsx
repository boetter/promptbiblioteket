interface EmptyStateProps {
  onAdd: () => void
  onBrowseCatalog: () => void
}

export default function EmptyState({ onAdd, onBrowseCatalog }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="text-6xl mb-6">📚</div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Velkommen til dit promptbibliotek
      </h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        Start med at skrive din egen prompt eller udforsk vores katalog med over 1.000 færdige prompts.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onBrowseCatalog}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition-colors cursor-pointer"
        >
          Udforsk kataloget
        </button>
        <button
          onClick={onAdd}
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-xl transition-colors cursor-pointer"
        >
          + Skriv din egen
        </button>
      </div>
    </div>
  )
}
