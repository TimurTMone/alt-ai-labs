'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme-provider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] text-zinc-500 hover:text-foreground hover:bg-accent transition-colors"
      title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
    >
      {theme === 'dark' ? (
        <Sun className="w-3.5 h-3.5" />
      ) : (
        <Moon className="w-3.5 h-3.5" />
      )}
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}
