import { useState, useEffect, useRef } from 'react'
import { Capacitor } from '@capacitor/core'
import { App as CapApp } from '@capacitor/app'
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
  const [exitToast, setExitToast] = useState(false)
  const pageRef = useRef('home')
  const lastBackRef = useRef(0)

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
    pageRef.current = 'standard'
    window.history.pushState({ page: 'standard' }, '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function navigateToComposite() {
    setPage('composite')
    pageRef.current = 'composite'
    window.history.pushState({ page: 'composite' }, '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function navigateToScenarios() {
    setPage('scenarios')
    pageRef.current = 'scenarios'
    window.history.pushState({ page: 'scenarios' }, '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function navigateHome() {
    setPage('home')
    pageRef.current = 'home'
    setSelectedFormula(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 浏览器/系统返回手势处理（popstate 覆盖所有场景）
  useEffect(() => {
    const handlePopState = () => {
      if (pageRef.current !== 'home') {
        setPage('home')
        pageRef.current = 'home'
        setSelectedFormula(null)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Capacitor 返回键：处理首页退出确认
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    const handler = CapApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back()
      } else {
        const now = Date.now()
        if (now - lastBackRef.current < 2000) {
          CapApp.exitApp()
        } else {
          lastBackRef.current = now
          setExitToast(true)
          setTimeout(() => setExitToast(false), 2000)
        }
      }
    })
    return () => { handler.then(h => h.remove()) }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {exitToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white text-sm px-5 py-2.5 rounded-full shadow-lg">
          再次返回退出应用
        </div>
      )}
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
