interface EmptyStateProps {
  onAdd: () => void
  onRestoreDefaults: () => void
}

export default function EmptyState({ onAdd, onRestoreDefaults }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="text-6xl mb-6">📚</div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Dit promptbibliotek er tomt
      </h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        Tilføj din egen prompt eller hent vores samling af standardprompts for at komme i gang.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onRestoreDefaults}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition-colors cursor-pointer"
        >
          Hent standardprompts
        </button>
        <button
          onClick={onAdd}
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-xl transition-colors cursor-pointer"
        >
          + Tilføj egen prompt
        </button>
      </div>
    </div>
  )
}
