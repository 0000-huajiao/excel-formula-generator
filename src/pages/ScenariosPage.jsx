import { useState } from 'react'
import { scenarios, SCENARIO_CATEGORIES } from '../data/scenarios'

const DIFFICULTY_STYLE = {
  green: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  red:   'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

// ─── 场景详情页 ───────────────────────────────────────────────

function ScenarioDetail({ scenario: s, onBack, onCopy }) {
  const [copied, setCopied] = useState(null)

  async function handleCopy(formula, idx) {
    try {
      await navigator.clipboard.writeText(formula)
    } catch {
      const el = document.createElement('textarea')
      el.value = formula
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(idx)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="page-container pt-4 pb-16">
      {/* 返回 */}
      <button onClick={onBack}
        className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-[#165DFF] dark:hover:text-[#4080FF] transition-colors font-medium mb-5">
        ← 返回场景库
      </button>

      {/* 标题区 */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{s.emoji}</span>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{s.title}</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_STYLE[s.difficultyColor]}`}>
            {s.difficulty}
          </span>
          {s.tags.map(t => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* 场景说明 */}
      <div className="mb-5 px-4 py-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900">
        <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">{s.desc}</p>
      </div>

      {/* 示例表结构 */}
      <div className="mb-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">示例数据结构</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {s.columns.map((col, i) => (
                  <th key={i} className={`px-3 py-2 text-left font-semibold rounded-t
                    ${col.col ? 'bg-[#165DFF]/10 dark:bg-[#4080FF]/10 text-[#165DFF] dark:text-[#4080FF]'
                              : 'bg-transparent text-gray-300 dark:text-gray-600'}`}>
                    {col.col ? `列${col.col}` : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {s.columns.map((col, i) => (
                  <td key={i} className="px-3 py-2 border-t border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-medium">
                    {col.name}
                  </td>
                ))}
              </tr>
              <tr>
                {s.columns.map((col, i) => (
                  <td key={i} className="px-3 py-2 border-t border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 text-xs">
                    {col.eg}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 公式方案 */}
      <div className="mb-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">公式方案</h2>
        {s.formulas.map((f, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{f.label}</span>
              <button
                onClick={() => handleCopy(f.formula, idx)}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-lg font-medium transition-all
                  ${copied === idx
                    ? 'bg-green-500 text-white'
                    : 'bg-[#165DFF] dark:bg-[#4080FF] text-white hover:opacity-90'}`}
              >
                {copied === idx ? '✓ 已复制' : '复制'}
              </button>
            </div>
            {/* 公式展示 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 mb-3 font-mono text-sm text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-nowrap">
              {f.formula}
            </div>
            {/* 解释 */}
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.explain}</p>
          </div>
        ))}
      </div>

      {/* 注意事项 */}
      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-100 dark:border-amber-900 p-4">
        <h2 className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-3">注意事项</h2>
        <ul className="space-y-2">
          {s.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
              <span className="shrink-0 mt-0.5 text-amber-500">•</span>
              <span className="leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ─── 场景列表页 ───────────────────────────────────────────────

export default function ScenariosPage({ onBack }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedId, setSelectedId] = useState(null)

  const selected = scenarios.find(s => s.id === selectedId)

  if (selected) {
    return <ScenarioDetail scenario={selected} onBack={() => setSelectedId(null)} />
  }

  const displayList = activeCategory === 'all'
    ? scenarios
    : scenarios.filter(s => s.category === activeCategory)

  return (
    <div className="page-container pt-4">
      {/* 返回 */}
      <button onClick={onBack}
        className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-[#165DFF] dark:hover:text-[#4080FF] transition-colors font-medium mb-5">
        ← 返回
      </button>

      {/* 标题 */}
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">💡 场景公式库</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">真实业务场景 · 开箱即用的公式方案</p>
      </div>

      {/* 分类 Tab */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
        {SCENARIO_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap
              ${activeCategory === cat.id
                ? 'bg-[#165DFF] dark:bg-[#4080FF] text-white'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-[#165DFF]/50'
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 场景卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayList.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedId(s.id)}
            className="text-left bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800
                       rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-[#165DFF]/30
                       dark:hover:border-[#4080FF]/30 active:scale-[0.99] transition-all"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0 mt-0.5">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{s.title}</span>
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${DIFFICULTY_STYLE[s.difficultyColor]}`}>
                    {s.difficulty}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{s.desc}</p>
                <div className="mt-2 flex gap-1 flex-wrap">
                  {s.tags.slice(0, 3).map(t => (
                    <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-gray-300 dark:text-gray-600 shrink-0">→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
