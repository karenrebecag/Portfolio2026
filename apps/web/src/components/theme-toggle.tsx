'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

export function ThemeToggle() {
  const t = useTranslations('theme')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = stored === 'dark' || (!stored && prefersDark)

    applyTheme(isDark ? 'dark' : 'light')

    function handleKeydown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || (e.target as HTMLElement).isContentEditable) return
      if (e.shiftKey && e.key === 'T') {
        e.preventDefault()
        toggleTheme()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [])

  function applyTheme(theme: 'light' | 'dark') {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.body.setAttribute('data-theme-status', theme)
    localStorage.setItem('theme', theme)
  }

  function toggleTheme() {
    const current = document.body.getAttribute('data-theme-status') || 'light'
    const next = current === 'light' ? 'dark' : 'light'
    applyTheme(next)
  }

  if (!mounted) return null

  return (
    <button
      data-theme-toggle
      onClick={toggleTheme}
      className="btn-darklight"
      aria-label="Toggle theme"
    >
      <div className="btn-darklight__icon">
        {/* Sun */}
        <div className="btn-darklight__icon-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none">
            <path d="M15.5355 8.46447C17.4882 10.4171 17.4882 13.5829 15.5355 15.5355C13.5829 17.4882 10.4171 17.4882 8.46447 15.5355C6.51184 13.5829 6.51184 10.4171 8.46447 8.46447C10.4171 6.51184 13.5829 6.51184 15.5355 8.46447Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 4V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 22V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.3599 5.63999L19.0699 4.92999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.93018 19.07L5.64018 18.36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.3599 18.36L19.0699 19.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.93018 4.92999L5.64018 5.63999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {/* Moon */}
        <div className="btn-darklight__icon-box is--absolute">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none">
            <path d="M18.395 13.027C18.725 12.872 19.077 13.197 18.985 13.55C18.671 14.752 18.054 15.896 17.104 16.846C14.283 19.667 9.77001 19.726 7.02201 16.978C4.27401 14.23 4.33401 9.71601 7.15501 6.89501C8.10501 5.94501 9.24801 5.32801 10.451 5.01401C10.804 4.92201 11.128 5.27401 10.974 5.60401C9.97201 7.74301 10.301 10.305 11.998 12.002C13.694 13.7 16.256 14.029 18.395 13.027Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="btn-darklight__word">
        <p className="btn-darklight__word-p">{t('light')}</p>
        <p className="btn-darklight__word-p is--absolute">{t('dark')}</p>
      </div>
      <p className="btn-darklight__word-p">{t('mode')}</p>
    </button>
  )
}
