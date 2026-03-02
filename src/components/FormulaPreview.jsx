import { useState, useCallback } from 'react'

export default function FormulaPreview({ formula, label = '公式预览' }) {
  const [copied, setCopied] = useState(false)
  const [fallback, setFallback] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formula)
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    } catch {
      // 降级：手动选中提示
      setFallback(true)
      setTimeout(() => setFallback(false), 3000)
    }
  }, [formula])

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</div>

      {/* 预览区 */}
      <div className="formula-preview min-h-[56px] flex items-center">
        <span>{formula}</span>
      </div>

      {/* 复制按钮 */}
      <button
        onClick={handleCopy}
        className="btn-copy"
        disabled={copied}
      >
        {copied ? (
          <>
            <span>✓</span>
            <span>复制成功</span>
          </>
        ) : (
          <>
            <span>💾</span>
            <span>一键复制公式</span>
          </>
        )}
      </button>

      {/* 降级提示 */}
      {fallback && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          剪贴板权限被拒绝，请手动选中上方公式内容复制
        </p>
      )}
    </div>
  )
}
