interface EmptyStateProps {
  onAdd: () => void
}

export default function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="text-6xl mb-6">📚</div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Dit promptbibliotek er tomt
      </h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        Tilføj din første prompt for at komme i gang. Du kan organisere, søge
        og genbruge dine prompts på tværs af ChatGPT, Claude og Gemini.
      </p>
      <button
        onClick={onAdd}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition-colors cursor-pointer"
      >
        + Tilføj din første prompt
      </button>
    </div>
  )
}
