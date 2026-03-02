import { useState, useEffect } from 'react'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import StandardPage from './pages/StandardPage'
import CompositePage from './pages/CompositePage'
import ScenariosPage from './pages/ScenariosPage'

// 初始化深色模式
function getInitialDark() {
  try {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch {}
  return false
}

export default function App() {
  const [dark, setDark] = useState(getInitialDark)
  const [page, setPage] = useState('home') // 'home' | 'standard' | 'composite' | 'scenarios'
  const [selectedFormula, setSelectedFormula] = useState(null)

  // 同步 dark 类到 html 元素
  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  function navigateToStandard(formula) {
    setSelectedFormula(formula)
    setPage('standard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function navigateToComposite() {
    setPage('composite')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function navigateToScenarios() {
    setPage('scenarios')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function navigateHome() {
    setPage('home')
    setSelectedFormula(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <Header
        dark={dark}
        onToggleDark={() => setDark(d => !d)}
        onGoHome={navigateHome}
      />

      <main>
        {page === 'home' && (
          <HomePage
            onSelectFormula={navigateToStandard}
            onGoComposite={navigateToComposite}
            onGoScenarios={navigateToScenarios}
          />
        )}
        {page === 'standard' && selectedFormula && (
          <StandardPage
            formula={selectedFormula}
            onBack={navigateHome}
          />
        )}
        {page === 'composite' && (
          <CompositePage
            onBack={navigateHome}
          />
        )}
        {page === 'scenarios' && (
          <ScenariosPage
            onBack={navigateHome}
          />
        )}
      </main>
    </div>
  )
}
