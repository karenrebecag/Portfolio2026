'use client'

import { useEffect, useState } from 'react'

const THEMES = [
  { id: 'light', label: 'Plantation', swatch: '#366B5E' },
  { id: 'dark', label: 'Night', swatch: '#5FA28F' },
  { id: 'mono', label: 'Mono', swatch: '#4a7a8a' },
] as const

type ThemeId = typeof THEMES[number]['id']

const THEME_CLASSES: Record<ThemeId, string> = {
  light: '',
  dark: 'dark',
  mono: 'mono',
}

function applyTheme(theme: ThemeId) {
  const html = document.documentElement
  html.classList.remove('dark', 'mono')
  const cls = THEME_CLASSES[theme]
  if (cls) html.classList.add(cls)
  document.body.setAttribute('data-theme-status', theme)
  localStorage.setItem('theme', theme)
}

function getStoredTheme(): ThemeId {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('theme') as ThemeId | null
  if (stored && THEME_CLASSES[stored] !== undefined) return stored
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [current, setCurrent] = useState<ThemeId>('light')

  useEffect(() => {
    const theme = getStoredTheme()
    applyTheme(theme)
    setCurrent(theme)
    setMounted(true)

    function handleKeydown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || (e.target as HTMLElement).isContentEditable) return
      if (e.shiftKey && e.key === 'T') {
        e.preventDefault()
        setCurrent((prev) => {
          const idx = THEMES.findIndex((t) => t.id === prev)
          const next = THEMES[(idx + 1) % THEMES.length].id
          applyTheme(next)
          return next
        })
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [])

  function selectTheme(theme: ThemeId) {
    applyTheme(theme)
    setCurrent(theme)
  }

  if (!mounted) return null

  return (
    <div className="theme-palette" role="radiogroup" aria-label="Theme">
      {THEMES.map((t) => (
        <button
          key={t.id}
          role="radio"
          aria-checked={current === t.id}
          onClick={() => selectTheme(t.id)}
          className={`theme-palette__swatch${current === t.id ? ' is--active' : ''}`}
          aria-label={t.label}
          title={t.label}
        >
          <span className="theme-palette__dot" style={{ background: t.swatch }} />
        </button>
      ))}
    </div>
  )
}
