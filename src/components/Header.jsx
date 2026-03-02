export default function Header({ dark, onToggleDark, onGoHome }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 font-bold text-lg text-[#165DFF] dark:text-[#4080FF] hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl">📊</span>
          <span className="hidden sm:inline">Excel公式生成器</span>
          <span className="sm:hidden">公式生成器</span>
        </button>

        <button
          onClick={onToggleDark}
          title={dark ? '切换浅色模式' : '切换深色模式'}
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg
                     hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="切换主题"
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
