function formatCount(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

export default function FormulaCard({ formula, onClick }) {
  return (
    <div
      className="card p-4 select-none"
      onClick={() => onClick(formula)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(formula)}
    >
      <div className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base leading-snug mb-2 line-clamp-2">
        {formula.name}
      </div>
      <div className="text-xs text-gray-400 dark:text-gray-500">
        使用量：{formatCount(formula.usageCount)}次
      </div>
    </div>
  )
}
