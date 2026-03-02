import { useState, useEffect, useRef } from 'react'
import {
  needsTypeConfirm,
  generateCascadeFormula,
  generateIntervalFormula,
  generateSwitchFormula,
  generateSumifsFormula,
  generateCountifsFormula,
} from '../data/formulas'
import FormulaPreview from '../components/FormulaPreview'
import TypeBubble from '../components/TypeBubble'

// ─── 模式定义 ────────────────────────────────────────────────

const MODES = [
  {
    id: 'cascade',
    label: 'IFS级联',
    emoji: '📊',
    desc: '阶梯条件判断，从上到下优先匹配。适合阶梯提成、等级评定等场景。',
    example: '如：业绩≥10000→20%，≥5000→10%，否则0',
  },
  {
    id: 'interval',
    label: 'IFS区间',
    emoji: '📏',
    desc: '明确填写上下界的区间判断，自动生成 AND 条件。适合分数段、区间分组。',
    example: '如：60≤分数<75→及格，75≤分数<90→良好',
  },
  {
    id: 'switch',
    label: 'SWITCH匹配',
    emoji: '🔄',
    desc: '精确值映射，一个值对应一个结果。适合部门代码转名称、状态翻译等。',
    example: '如：A→销售部，B→运营部，其他→待定',
  },
  {
    id: 'sumifs',
    label: 'SUMIFS',
    emoji: '➕',
    desc: '多条件求和，同时满足所有筛选条件的行进行求和。',
    example: '如：部门=销售 且 状态=完成 的金额合计',
  },
  {
    id: 'countifs',
    label: 'COUNTIFS',
    emoji: '🔢',
    desc: '多条件计数，统计同时满足所有筛选条件的行数。',
    example: '如：部门=销售 且 金额>1000 的记录数',
  },
]

const CASCADE_OPS = ['>=', '<=', '>', '<', '=', '<>']
const INTERVAL_OPS1 = ['>=', '>']
const INTERVAL_OPS2 = ['<', '<=']

// ─── 工厂函数 ────────────────────────────────────────────────

let _id = Date.now()
const uid = () => ++_id

const mk = {
  cascade: () => ({ id: uid(), left: '', operator: '>=', right: '', result: '', rightType: null, resultType: null }),
  interval: () => ({ id: uid(), op1: '>=', bound1: '', op2: '<', bound2: '', result: '', resultType: null }),
  switch: () => ({ id: uid(), matchValue: '', result: '', matchType: null, resultType: null }),
  agg: () => ({ id: uid(), criteriaRange: '', criteriaValue: '' }),
}

// ─── 初始状态 ────────────────────────────────────────────────

const INIT = {
  mode: 'cascade',
  cascade: { conditions: [mk.cascade()], defaultResult: '', defaultType: null },
  interval: { baseCell: '', conditions: [mk.interval()], defaultResult: '', defaultType: null },
  switch: { switchTarget: '', conditions: [mk.switch()], defaultResult: '', defaultType: null },
  sumifs: { sumRange: '', conditions: [mk.agg()] },
  countifs: { conditions: [mk.agg()] },
}

function loadState() {
  try {
    const s = localStorage.getItem('composite_v2')
    if (s) return { ...INIT, ...JSON.parse(s) }
  } catch {}
  return INIT
}

// ─── 公式生成（memoized by state） ──────────────────────────

function buildFormula(mode, st) {
  switch (mode) {
    case 'cascade':
      return generateCascadeFormula(st.cascade.conditions, st.cascade.defaultResult, st.cascade.defaultType)
    case 'interval':
      return generateIntervalFormula(st.interval.baseCell, st.interval.conditions, st.interval.defaultResult, st.interval.defaultType)
    case 'switch':
      return generateSwitchFormula(st.switch.switchTarget, st.switch.conditions, st.switch.defaultResult, st.switch.defaultType)
    case 'sumifs':
      return generateSumifsFormula(st.sumifs.sumRange, st.sumifs.conditions)
    case 'countifs':
      return generateCountifsFormula(st.countifs.conditions)
    default: return ''
  }
}

// ─── 主组件 ─────────────────────────────────────────────────

export default function CompositePage({ onBack }) {
  const [st, setSt] = useState(loadState)
  const [bubble, setBubble] = useState(null) // { mode, condId, field }
  const bubbleRef = useRef(null)

  const mode = st.mode
  const formula = buildFormula(mode, st)

  // 持久化
  useEffect(() => {
    try { localStorage.setItem('composite_v2', JSON.stringify(st)) } catch {}
  }, [st])

  // 点外部关闭气泡
  useEffect(() => {
    const handler = e => {
      if (bubbleRef.current && !bubbleRef.current.contains(e.target)) setBubble(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ─── 通用 helpers ─────────────────────────────

  function setMode(m) { setSt(s => ({ ...s, mode: m })); setBubble(null) }

  function patchMode(patch) {
    setSt(s => ({ ...s, [mode]: { ...s[mode], ...patch } }))
  }

  function patchCondition(condId, patch) {
    setSt(s => ({
      ...s,
      [mode]: {
        ...s[mode],
        conditions: s[mode].conditions.map(c => c.id === condId ? { ...c, ...patch } : c),
      },
    }))
  }

  function addCondition() {
    setSt(s => ({
      ...s,
      [mode]: {
        ...s[mode],
        conditions: [...s[mode].conditions, mk[mode === 'sumifs' || mode === 'countifs' ? 'agg' : mode]()],
      },
    }))
  }

  function removeCondition(condId) {
    setSt(s => {
      const conds = s[mode].conditions
      if (conds.length <= 1) return s
      return { ...s, [mode]: { ...s[mode], conditions: conds.filter(c => c.id !== condId) } }
    })
  }

  function resetMode() {
    setSt(s => ({ ...s, [mode]: INIT[mode] }))
    setBubble(null)
  }

  // ─── 气泡处理 ─────────────────────────────────

  function handleBlur(condId, field, value) {
    if (needsTypeConfirm(value)) setBubble({ condId, field })
  }

  function handleTypeSelect(type) {
    if (!bubble) return
    const { condId, field } = bubble
    setBubble(null)

    if (condId === '__default__') {
      const val = st[mode].defaultResult.trim()
      patchMode({
        defaultType: type,
        defaultResult: type === 'text' && !val.startsWith('"') ? `"${val}"` : val,
      })
      return
    }

    const cond = st[mode].conditions.find(c => c.id === condId)
    if (!cond) return
    const typeField = field === 'matchValue' ? 'matchType' : field === 'right' ? 'rightType' : 'resultType'
    let newVal = (cond[field] || '').trim()
    if (type === 'text' && !newVal.startsWith('"')) newVal = `"${newVal}"`
    patchCondition(condId, { [field]: newVal, [typeField]: type })
  }

  // ─── 渲染辅助 ─────────────────────────────────

  function BubbleWrapper({ condId, field, children }) {
    const show = bubble?.condId === condId && bubble?.field === field
    return (
      <div className="relative flex-1 min-w-0">
        {children}
        {show && (
          <div ref={bubbleRef}>
            <TypeBubble
              value={condId === '__default__' ? st[mode].defaultResult : (st[mode].conditions.find(c => c.id === condId)?.[field] || '')}
              onSelect={handleTypeSelect}
            />
          </div>
        )}
      </div>
    )
  }

  const rowBase = 'flex flex-wrap items-center gap-2'
  const condRow = `condition-row ${rowBase}`
  const defRow = `default-row ${rowBase}`
  const miniInput = 'param-input text-sm min-w-0'
  const delBtn = 'shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-[#F53F3F] hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
  const numBadge = 'text-xs font-semibold text-gray-400 dark:text-gray-500 w-5 shrink-0 text-center'
  const arrow = 'text-gray-400 dark:text-gray-500 text-sm shrink-0'

  // ─── 模式 UI ──────────────────────────────────

  function renderCascade() {
    const { conditions, defaultResult } = st.cascade
    return (
      <>
        <div className="space-y-2">
          {conditions.map((c, idx) => (
            <div key={c.id} className="condition-row space-y-2">
              {/* 行头：序号 + 删除 */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">条件 {idx + 1}</span>
                <button onClick={() => removeCondition(c.id)} disabled={conditions.length <= 1}
                  className="text-xs text-[#F53F3F] disabled:opacity-30 disabled:cursor-not-allowed hover:underline transition-opacity"
                  title="删除此行">删除</button>
              </div>
              {/* 第一行：判断区域 + 运算符 + 阈值 */}
              <div className="flex items-center gap-2">
                <input className={`${miniInput} flex-1`} value={c.left}
                  onChange={e => patchCondition(c.id, { left: e.target.value })}
                  placeholder="判断区域，如 A2" aria-label="判断区域" />
                <select className={`${miniInput} w-[4.5rem] shrink-0`} value={c.operator}
                  onChange={e => patchCondition(c.id, { operator: e.target.value })}>
                  {CASCADE_OPS.map(op => <option key={op}>{op}</option>)}
                </select>
                <BubbleWrapper condId={c.id} field="right">
                  <input className={`${miniInput} w-full`} value={c.right}
                    onChange={e => patchCondition(c.id, { right: e.target.value, rightType: null })}
                    onBlur={e => handleBlur(c.id, 'right', e.target.value)}
                    placeholder="阈值，如 10000 或 &quot;完成&quot;" aria-label="阈值" />
                </BubbleWrapper>
              </div>
              {/* 第二行：返回值 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 w-10">→ 返回</span>
                <BubbleWrapper condId={c.id} field="result">
                  <input className={`${miniInput} w-full`} value={c.result}
                    onChange={e => patchCondition(c.id, { result: e.target.value, resultType: null })}
                    onBlur={e => handleBlur(c.id, 'result', e.target.value)}
                    placeholder="返回值，如 A2*0.2 或 &quot;达标&quot;" aria-label="返回值" />
                </BubbleWrapper>
              </div>
            </div>
          ))}
        </div>

        <button onClick={addCondition} className="mt-3 w-full py-2.5 border-2 border-dashed border-[#165DFF]/30 dark:border-[#4080FF]/30 text-[#165DFF] dark:text-[#4080FF] rounded-xl text-sm font-medium hover:border-[#165DFF]/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">
          ➕ 新增条件行
        </button>

        <DefaultRow label="以上条件都不满足 → 返回"
          value={defaultResult} onBlur={v => handleBlur('__default__', 'defaultResult', v)}
          onChange={v => patchMode({ defaultResult: v, defaultType: null })} />
      </>
    )
  }

  function renderInterval() {
    const { baseCell, conditions, defaultResult } = st.interval
    return (
      <>
        {/* 共享判断单元格 */}
        <div className="mb-4 flex items-center gap-3 bg-[#F5F7FA] dark:bg-gray-800 rounded-xl px-4 py-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 shrink-0">判断单元格</span>
          <input className={`${miniInput} w-36`} value={baseCell}
            onChange={e => patchMode({ baseCell: e.target.value })}
            placeholder="如 A2" aria-label="判断单元格" />
          <span className="text-xs text-gray-400 dark:text-gray-500">（所有区间条件共用此单元格）</span>
        </div>

        <div className="space-y-2">
          {conditions.map((c, idx) => (
            <div key={c.id} className="condition-row space-y-2">
              {/* 行头 */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">区间 {idx + 1}</span>
                <button onClick={() => removeCondition(c.id)} disabled={conditions.length <= 1}
                  className="text-xs text-[#F53F3F] disabled:opacity-30 disabled:cursor-not-allowed hover:underline transition-opacity">删除</button>
              </div>
              {/* 第一行：下限 + 且 + 上限 */}
              <div className="flex items-center gap-2">
                <select className={`${miniInput} w-[4.5rem] shrink-0`} value={c.op1}
                  onChange={e => patchCondition(c.id, { op1: e.target.value })}>
                  {INTERVAL_OPS1.map(op => <option key={op}>{op}</option>)}
                </select>
                <input className={`${miniInput} flex-1`} value={c.bound1}
                  onChange={e => patchCondition(c.id, { bound1: e.target.value })}
                  placeholder="下限，如 60" aria-label="下限" />
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">且</span>
                <select className={`${miniInput} w-[4.5rem] shrink-0`} value={c.op2}
                  onChange={e => patchCondition(c.id, { op2: e.target.value })}>
                  {INTERVAL_OPS2.map(op => <option key={op}>{op}</option>)}
                </select>
                <input className={`${miniInput} flex-1`} value={c.bound2}
                  onChange={e => patchCondition(c.id, { bound2: e.target.value })}
                  placeholder="上限（可留空）" aria-label="上限" />
              </div>
              {/* 第二行：返回值 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 w-10">→ 返回</span>
                <BubbleWrapper condId={c.id} field="result">
                  <input className={`${miniInput} w-full`} value={c.result}
                    onChange={e => patchCondition(c.id, { result: e.target.value, resultType: null })}
                    onBlur={e => handleBlur(c.id, 'result', e.target.value)}
                    placeholder='返回值，如 "及格" 或 A2*0.1' aria-label="返回值" />
                </BubbleWrapper>
              </div>
            </div>
          ))}
        </div>

        <button onClick={addCondition} className="mt-3 w-full py-2.5 border-2 border-dashed border-[#165DFF]/30 dark:border-[#4080FF]/30 text-[#165DFF] dark:text-[#4080FF] rounded-xl text-sm font-medium hover:border-[#165DFF]/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">
          ➕ 新增区间行
        </button>

        <DefaultRow label="以上区间都不满足 → 返回"
          value={defaultResult} onBlur={v => handleBlur('__default__', 'defaultResult', v)}
          onChange={v => patchMode({ defaultResult: v, defaultType: null })} />
      </>
    )
  }

  function renderSwitch() {
    const { switchTarget, conditions, defaultResult } = st.switch
    return (
      <>
        {/* 匹配目标 */}
        <div className="mb-4 flex items-center gap-3 bg-[#F5F7FA] dark:bg-gray-800 rounded-xl px-4 py-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 shrink-0">匹配目标</span>
          <input className={`${miniInput} w-36`} value={switchTarget}
            onChange={e => patchMode({ switchTarget: e.target.value })}
            placeholder="如 A2" aria-label="匹配目标单元格" />
          <span className="text-xs text-gray-400 dark:text-gray-500">（用于精确匹配的单元格）</span>
        </div>

        <div className="space-y-2">
          {conditions.map((c, idx) => (
            <div key={c.id} className="condition-row space-y-2">
              {/* 行头：序号 + 删除 */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">匹配项 {idx + 1}</span>
                <button onClick={() => removeCondition(c.id)} disabled={conditions.length <= 1}
                  className="text-xs text-[#F53F3F] disabled:opacity-30 disabled:cursor-not-allowed hover:underline transition-opacity"
                  title="删除此行">删除</button>
              </div>
              {/* 第一行：当等于 + 匹配值 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">当等于</span>
                <BubbleWrapper condId={c.id} field="matchValue">
                  <input className={`${miniInput} w-full`} value={c.matchValue}
                    onChange={e => patchCondition(c.id, { matchValue: e.target.value, matchType: null })}
                    onBlur={e => handleBlur(c.id, 'matchValue', e.target.value)}
                    placeholder='匹配值，如 "销售" 或 A2' aria-label="匹配值" />
                </BubbleWrapper>
              </div>
              {/* 第二行：返回值 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 w-10">→ 返回</span>
                <BubbleWrapper condId={c.id} field="result">
                  <input className={`${miniInput} w-full`} value={c.result}
                    onChange={e => patchCondition(c.id, { result: e.target.value, resultType: null })}
                    onBlur={e => handleBlur(c.id, 'result', e.target.value)}
                    placeholder='返回值，如 "销售部" 或 B2' aria-label="返回值" />
                </BubbleWrapper>
              </div>
            </div>
          ))}
        </div>

        <button onClick={addCondition} className="mt-3 w-full py-2.5 border-2 border-dashed border-[#165DFF]/30 dark:border-[#4080FF]/30 text-[#165DFF] dark:text-[#4080FF] rounded-xl text-sm font-medium hover:border-[#165DFF]/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">
          ➕ 新增匹配项
        </button>

        <DefaultRow label="以上值都不匹配 → 返回"
          value={defaultResult} onBlur={v => handleBlur('__default__', 'defaultResult', v)}
          onChange={v => patchMode({ defaultResult: v, defaultType: null })} />
      </>
    )
  }

  function renderSumifs() {
    const { sumRange, conditions } = st.sumifs
    return (
      <>
        {/* 求和区域 */}
        <div className="mb-4 flex items-center gap-3 bg-[#F5F7FA] dark:bg-gray-800 rounded-xl px-4 py-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 shrink-0">求和数值列</span>
          <input className={`${miniInput} w-36`} value={sumRange}
            onChange={e => patchMode({ sumRange: e.target.value })}
            placeholder="如 C:C" aria-label="求和数值列" />
          <span className="text-xs text-gray-400 dark:text-gray-500">（要合计的数值所在列）</span>
        </div>

        <div className="space-y-2">
          {conditions.map((c, idx) => (
            <AggRow key={c.id} idx={idx} c={c}
              onUpdate={patch => patchCondition(c.id, patch)}
              onRemove={() => removeCondition(c.id)}
              canRemove={conditions.length > 1} />
          ))}
        </div>

        <button onClick={addCondition} className="mt-3 w-full py-2.5 border-2 border-dashed border-[#165DFF]/30 dark:border-[#4080FF]/30 text-[#165DFF] dark:text-[#4080FF] rounded-xl text-sm font-medium hover:border-[#165DFF]/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">
          ➕ 新增筛选条件
        </button>

        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-xs text-amber-700 dark:text-amber-300">
          <strong>条件值写法：</strong>文字用引号（如 <code>"销售部"</code>），
          数值比较用引号包裹运算符（如 <code>"&gt;1000"</code>），
          单元格引用直接填（如 <code>D2</code>）
        </div>
      </>
    )
  }

  function renderCountifs() {
    const { conditions } = st.countifs
    return (
      <>
        <div className="space-y-2">
          {conditions.map((c, idx) => (
            <AggRow key={c.id} idx={idx} c={c}
              onUpdate={patch => patchCondition(c.id, patch)}
              onRemove={() => removeCondition(c.id)}
              canRemove={conditions.length > 1} />
          ))}
        </div>

        <button onClick={addCondition} className="mt-3 w-full py-2.5 border-2 border-dashed border-[#165DFF]/30 dark:border-[#4080FF]/30 text-[#165DFF] dark:text-[#4080FF] rounded-xl text-sm font-medium hover:border-[#165DFF]/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">
          ➕ 新增筛选条件
        </button>

        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-xs text-amber-700 dark:text-amber-300">
          <strong>条件值写法：</strong>文字用引号（如 <code>"完成"</code>），
          数值比较用引号包裹运算符（如 <code>"&gt;=100"</code>），
          单元格引用直接填（如 <code>A2</code>）
        </div>
      </>
    )
  }

  const modeRenderers = { cascade: renderCascade, interval: renderInterval, switch: renderSwitch, sumifs: renderSumifs, countifs: renderCountifs }
  const currentMode = MODES.find(m => m.id === mode)

  return (
    <div className="page-container pt-4">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-[#165DFF] dark:hover:text-[#4080FF] transition-colors font-medium">
          ← 返回
        </button>
        <button onClick={resetMode}
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          重置当前模式
        </button>
      </div>

      {/* 标题 */}
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-5">
        多条件组合公式生成
      </h1>

      {/* 模式切换 Tab */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide">
        {MODES.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap
              ${mode === m.id
                ? 'bg-[#165DFF] dark:bg-[#4080FF] text-white shadow-sm'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-[#165DFF]/50 dark:hover:border-[#4080FF]/50'
              }`}>
            <span>{m.emoji}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* 当前模式说明 */}
      <div className="mb-5 px-4 py-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900">
        <p className="text-sm text-blue-700 dark:text-blue-300">{currentMode?.desc}</p>
        <p className="text-xs text-blue-500 dark:text-blue-400 mt-0.5">{currentMode?.example}</p>
      </div>

      {/* 条件配置区 */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 mb-5 shadow-sm">
        <h2 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-4">条件配置区</h2>
        {modeRenderers[mode]?.()}
      </div>

      {/* 公式预览 + 复制 */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
        <FormulaPreview formula={formula} label="公式预览区（高亮）" />
      </div>
    </div>
  )
}

// ─── 子组件 ─────────────────────────────────────────────────

function DefaultRow({ label, value, onChange, onBlur }) {
  return (
    <div className="mt-3 default-row flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full shrink-0">
        兜底（不可删除）
      </span>
      <span className="text-sm text-gray-600 dark:text-gray-400 shrink-0">{label}</span>
      <input
        className="param-input flex-1 min-w-0 text-sm"
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={e => onBlur(e.target.value)}
        placeholder='兜底值（如 0 或 "其他"）'
        aria-label="兜底返回值"
      />
    </div>
  )
}

function AggRow({ idx, c, onUpdate, onRemove, canRemove }) {
  return (
    <div className="condition-row flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 w-5 shrink-0 text-center">{idx + 1}</span>
      <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">条件列</span>
      <input className="param-input text-sm w-28 min-w-0" value={c.criteriaRange}
        onChange={e => onUpdate({ criteriaRange: e.target.value })}
        placeholder="如 A:A" aria-label="条件列" />
      <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">条件值</span>
      <input className="param-input text-sm flex-1 min-w-0" value={c.criteriaValue}
        onChange={e => onUpdate({ criteriaValue: e.target.value })}
        placeholder='如 "销售部" 或 ">1000"' aria-label="条件值" />
      <button onClick={onRemove} disabled={!canRemove}
        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-[#F53F3F] hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
        ×
      </button>
    </div>
  )
}
