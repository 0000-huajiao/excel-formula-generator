import { useState, useEffect } from 'react'
import { generateStandardFormula } from '../data/formulas'
import FormulaPreview from '../components/FormulaPreview'

export default function StandardPage({ formula, onBack }) {
  // 从 localStorage 恢复上次填写的参数
  const storageKey = `params_${formula.id}`
  const [values, setValues] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) return JSON.parse(saved)
    } catch {}
    // 填充默认值
    const defaults = {}
    formula.params.forEach(p => {
      defaults[p.name] = p.default || ''
    })
    return defaults
  })

  // 持久化到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(values))
    } catch {}
  }, [values, storageKey])

  const generatedFormula = generateStandardFormula(formula.template, formula.params, values)

  function handleChange(paramName, val) {
    setValues(prev => ({ ...prev, [paramName]: val }))
  }

  function handleReset() {
    const defaults = {}
    formula.params.forEach(p => { defaults[p.name] = p.default || '' })
    setValues(defaults)
    try { localStorage.removeItem(storageKey) } catch {}
  }

  return (
    <div className="page-container pt-4">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400
                     hover:text-[#165DFF] dark:hover:text-[#4080FF] transition-colors font-medium"
        >
          ← 返回
        </button>
        <button
          onClick={handleReset}
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          重置
        </button>
      </div>

      {/* 标题 */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          {formula.name}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm leading-relaxed">
          {formula.desc}
        </p>
        <div className="mt-2 text-xs text-gray-300 dark:text-gray-600 font-mono">
          模板：{formula.template}
        </div>
      </div>

      {/* 参数填写区 */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 mb-6 shadow-sm">
        <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 text-sm">
          参数填写区
        </h2>
        <div className="space-y-4">
          {formula.params.map(param => (
            <div key={param.name}>
              <label className="block mb-1.5">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{param.name}</span>
                {param.hint && (
                  <span className="block text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-relaxed">
                    {param.hint}
                  </span>
                )}
              </label>
              <input
                type="text"
                value={values[param.name] || ''}
                onChange={e => handleChange(param.name, e.target.value)}
                placeholder={param.placeholder}
                className="param-input"
                aria-label={param.name}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 公式预览 + 复制 */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
        <FormulaPreview formula={generatedFormula} label="公式预览区" />
      </div>

      <p className="mt-6 text-center text-xs text-gray-300 dark:text-gray-600">
        未填写的参数将显示为 [参数名称] 占位符，可直接复制
      </p>
    </div>
  )
}
