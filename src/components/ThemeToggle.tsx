'use client'

import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? '切換淺色模式' : '切換深色模式'}
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
      style={{
        background: theme === 'dark'
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.06)',
        border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        backdropFilter: 'blur(12px)',
      }}
    >
      <span className="text-lg leading-none">
        {theme === 'dark' ? '☀️' : '🌙'}
      </span>
    </button>
  )
}
