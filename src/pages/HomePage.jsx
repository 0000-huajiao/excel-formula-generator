import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import Fuse from 'fuse.js'
import { formulas, FORMULA_CATEGORIES } from '../data/formulas'
import { scenarios } from '../data/scenarios'
import { matchIntents } from '../data/keywords'
import FormulaCard from '../components/FormulaCard'

const fuse = new Fuse(formulas, {
  keys: ['name', 'desc', 'tags'],
  threshold: 0.4,
  minMatchCharLength: 1,
})

// 根据 ID 列表取公式对象
function getFormulasByIds(ids) {
  return ids.map(id => formulas.find(f => f.id === id)).filter(Boolean)
}

// 根据 ID 列表取场景对象
function getScenariosByIds(ids) {
  return ids.map(id => scenarios.find(s => s.id === id)).filter(Boolean)
}

export default function HomePage({ onSelectFormula, onGoComposite, onGoScenarios }) {
  const [query, setQuery]               = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false)
  const inputRef       = useRef(null)
  const dropdownRef    = useRef(null)
  const categoryMenuRef = useRef(null)

  // Fuse 精确搜索
  const fuseResults = useMemo(() => {
    if (!query.trim()) return []
    return fuse.search(query.trim()).map(r => r.item)
  }, [query])

  // 意图关键词匹配
  const intentResults = useMemo(() => {
    if (!query.trim()) return []
    return matchIntents(query.trim())
  }, [query])

  // 意图命中的公式（去重）
  const intentFormulas = useMemo(() => {
    const seen = new Set()
    const result = []
    for (const intent of intentResults) {
      for (const f of getFormulasByIds(intent.formulaIds)) {
        if (!seen.has(f.id)) { seen.add(f.id); result.push(f) }
      }
    }
    return result.slice(0, 6)
  }, [intentResults])

  // 意图命中的场景（去重）
  const intentScenarios = useMemo(() => {
    const seen = new Set()
    const result = []
    for (const intent of intentResults) {
      for (const s of getScenariosByIds(intent.scenarioIds || [])) {
        if (!seen.has(s.id)) { seen.add(s.id); result.push(s) }
      }
    }
    return result.slice(0, 3)
  }, [intentResults])

  // Fuse 结果中过滤掉已在意图里出现的（避免重复）
  const intentFormulaIds = new Set(intentFormulas.map(f => f.id))
  const pureSearchResults = fuseResults.filter(f => !intentFormulaIds.has(f.id)).slice(0, 6)

  const hasIntent  = intentFormulas.length > 0 || intentScenarios.length > 0
  const hasSearch  = pureSearchResults.length > 0
  const hasAnything = hasIntent || hasSearch

  const categoryFormulas = useMemo(() => {
    if (activeCategory === 'all') return formulas
    return formulas.filter(f => f.category === activeCategory)
  }, [activeCategory])

  // 关闭下拉框（点击外部）
  useEffect(() => {
    function handleClick(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        setDropdownOpen(false)
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target)) {
        setCategoryMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleInput(e) {
    setQuery(e.target.value)
    setDropdownOpen(true)
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setDropdownOpen(false)
      inputRef.current?.blur()
    }
  }

  function handleSelectFormula(formula) {
    setDropdownOpen(false)
    setQuery('')
    onSelectFormula(formula)
  }

  function handleSelectScenario() {
    setDropdownOpen(false)
    setQuery('')
    onGoScenarios()
  }

  const isSearching = query.trim().length > 0
  const displayList = isSearching ? fuseResults : categoryFormulas

  // 最顶部的意图提示文案（取第一个命中意图的 tip）
  const topTip = intentResults[0]?.tip

  // 回到顶部按钮
  const [showBackToTop, setShowBackToTop] = useState(false)
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="page-container pt-6">
      {/* 搜索区 */}
      <div className="relative mb-5">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">🔍</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInput}
              onFocus={() => query && setDropdownOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="描述你的需求，如&quot;统计满足条件的数量&quot;"
              className="w-full border-2 border-[#165DFF] dark:border-[#4080FF] rounded-xl pl-10 pr-4 py-3
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-[#165DFF]/30 dark:focus:ring-[#4080FF]/30
                         placeholder:text-gray-400 dark:placeholder:text-gray-500
                         text-base transition-colors"
              aria-label="搜索公式"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setDropdownOpen(false); inputRef.current?.focus() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="清空搜索"
              >✕</button>
            )}
          </div>
          <button
            onClick={() => { if (fuseResults[0]) handleSelectFormula(fuseResults[0]) }}
            className="btn-primary px-5 rounded-xl font-semibold"
          >搜索</button>
        </div>

        {/* ── 智能下拉 ── */}
        {dropdownOpen && isSearching && (
          <div
            ref={dropdownRef}
            className="search-dropdown absolute left-0 right-0 top-full mt-1 z-30
                       bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700
                       rounded-2xl overflow-hidden shadow-lg"
          >
            {hasAnything ? (
              <div className="max-h-[70vh] overflow-y-auto">

                {/* 意图推荐区 */}
                {hasIntent && (
                  <div className="px-4 pt-3 pb-2">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-xs font-semibold text-[#165DFF] dark:text-[#4080FF]">💡 根据你的描述推荐</span>
                    </div>

                    {/* 推荐提示 */}
                    {topTip && (
                      <div className="mb-2.5 px-3 py-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                        {topTip}
                      </div>
                    )}

                    {/* 推荐公式 chips */}
                    {intentFormulas.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {intentFormulas.map(f => (
                          <button
                            key={f.id}
                            onClick={() => handleSelectFormula(f)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F7FA] dark:bg-gray-800
                                       hover:bg-[#165DFF]/10 dark:hover:bg-[#4080FF]/20
                                       border border-gray-200 dark:border-gray-700
                                       hover:border-[#165DFF]/40 dark:hover:border-[#4080FF]/40
                                       rounded-xl text-sm font-medium text-gray-800 dark:text-gray-200
                                       transition-colors"
                          >
                            <span className="text-[#165DFF] dark:text-[#4080FF] text-xs font-bold">
                              {f.name.match(/[A-Z+]+$/)?.[0] || f.name.slice(0, 8)}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 text-xs hidden sm:block">
                              {f.desc.slice(0, 12)}…
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* 推荐场景 */}
                    {intentScenarios.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {intentScenarios.map(s => (
                          <button
                            key={s.id}
                            onClick={handleSelectScenario}
                            className="flex items-center gap-1.5 px-3 py-1.5
                                       bg-green-50 dark:bg-green-950/30
                                       border border-green-200 dark:border-green-800
                                       hover:border-green-400 dark:hover:border-green-600
                                       rounded-xl text-sm transition-colors"
                          >
                            <span>{s.emoji}</span>
                            <span className="text-green-700 dark:text-green-400 font-medium text-xs">{s.title}</span>
                            <span className="text-xs text-green-500 dark:text-green-600">场景</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 分割线 */}
                {hasIntent && hasSearch && (
                  <div className="mx-4 border-t border-gray-100 dark:border-gray-800 my-1" />
                )}

                {/* 精确匹配区 */}
                {hasSearch && (
                  <div className="px-4 pt-2 pb-3">
                    {hasIntent && (
                      <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2">🔍 精确匹配</div>
                    )}
                    {pureSearchResults.map(f => (
                      <button
                        key={f.id}
                        onClick={() => handleSelectFormula(f)}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F5F7FA] dark:hover:bg-gray-800
                                   flex items-center justify-between gap-3 transition-colors"
                      >
                        <span className="font-medium text-gray-800 dark:text-gray-100 text-sm">{f.name}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 hidden sm:block">
                          {f.desc.slice(0, 18)}…
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="px-4 py-5 text-sm text-gray-400 dark:text-gray-500 text-center">
                未找到匹配公式，试试换个描述方式？
              </div>
            )}
          </div>
        )}
      </div>

      {/* 分类选择器 */}
      {!isSearching && (
        <div className="relative mb-4" ref={categoryMenuRef}>
          {/* 触发按钮 */}
          <button
            onClick={() => setCategoryMenuOpen(o => !o)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl
                       bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                       hover:border-[#165DFF]/50 dark:hover:border-[#4080FF]/50
                       text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <span>{FORMULA_CATEGORIES.find(c => c.id === activeCategory)?.emoji}</span>
            <span>{FORMULA_CATEGORIES.find(c => c.id === activeCategory)?.label}</span>
            <svg className={`w-3.5 h-3.5 text-gray-400 ml-0.5 transition-transform ${categoryMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          {/* 下拉面板 */}
          {categoryMenuOpen && (
            <div className="absolute top-full left-0 mt-1.5 z-20 w-64
                            bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700
                            rounded-2xl shadow-xl overflow-hidden p-1.5">
              <div className="grid grid-cols-2 gap-0.5">
                {FORMULA_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setCategoryMenuOpen(false) }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors text-left
                      ${activeCategory === cat.id
                        ? 'bg-[#165DFF]/10 dark:bg-[#4080FF]/15 text-[#165DFF] dark:text-[#4080FF]'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 功能入口：场景库 + 高级组合（搜索时隐藏） */}
      {!isSearching && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <button
            onClick={onGoScenarios}
            className="bg-white dark:bg-gray-900 border-2 border-[#00B42A]/40 dark:border-[#00B42A]/30
                       rounded-2xl px-4 py-3 flex items-center justify-between
                       hover:border-[#00B42A]/70 hover:bg-green-50/50 dark:hover:bg-green-950/20
                       active:scale-[0.99] transition-all"
          >
            <div className="text-left">
              <div className="font-bold text-sm text-gray-900 dark:text-gray-100">💡 场景公式库</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">45个真实业务场景 · 开箱即用</div>
            </div>
            <span className="text-gray-400 ml-3 shrink-0">→</span>
          </button>

          <button
            onClick={onGoComposite}
            className="bg-gradient-to-r from-[#165DFF] to-[#4080FF] dark:from-[#1a3a8f] dark:to-[#2a5acc]
                       text-white rounded-2xl px-4 py-3 flex items-center justify-between
                       hover:opacity-90 active:scale-[0.99] transition-all"
          >
            <div className="text-left">
              <div className="font-bold text-sm">➕ 高级组合</div>
              <div className="text-blue-100 text-xs mt-0.5">IFS · SWITCH · SUMIFS · COUNTIFS</div>
            </div>
            <span className="ml-3 shrink-0">→</span>
          </button>
        </div>
      )}

      {/* 公式列表 */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-400 dark:text-gray-500 mb-3 tracking-wide uppercase">
          {isSearching
            ? `搜索结果（${fuseResults.length}个）`
            : `${FORMULA_CATEGORIES.find(c => c.id === activeCategory)?.label} · ${categoryFormulas.length}个公式`
          }
        </h2>

        {displayList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {displayList.map(f => (
              <FormulaCard key={f.id} formula={f} onClick={onSelectFormula} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400 dark:text-gray-500">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">未找到匹配公式</p>
          </div>
        )}
      </section>

      <p className="mt-2 text-center text-xs text-gray-300 dark:text-gray-600">
        生成的公式支持 Excel 和 WPS · 核心功能完全离线可用
      </p>

      {/* 回到顶部按钮 */}
      {/* 页脚 */}
      <div className="mt-10 pb-8 text-center">
        <a
          href="privacy.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 dark:text-gray-600 hover:text-[#165DFF] dark:hover:text-[#4080FF] transition-colors"
        >
          隐私政策
        </a>
      </div>

      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-5 z-50 w-10 h-10 rounded-full shadow-lg
                     bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                     text-gray-500 dark:text-gray-400 hover:text-[#165DFF] dark:hover:text-[#4080FF]
                     hover:border-[#165DFF]/50 hover:shadow-xl
                     flex items-center justify-center transition-all"
          aria-label="回到顶部"
        >↑</button>
      )}
    </div>
  )
}
