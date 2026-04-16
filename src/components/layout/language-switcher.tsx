'use client'

import { useState } from 'react'
import { Globe } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { LOCALE_LABELS, type Locale } from '@/lib/i18n/translations'

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  const [open, setOpen] = useState(false)

  const locales: Locale[] = ['en', 'ru', 'ky']

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] text-zinc-500 hover:text-white hover:bg-white/[0.04] transition-colors"
      >
        <Globe className="w-3.5 h-3.5" />
        {locale.toUpperCase()}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 mb-1 bg-[#18181b] border border-white/[0.08] rounded-xl overflow-hidden z-50 min-w-[120px] shadow-xl">
            {locales.map(l => (
              <button
                key={l}
                onClick={() => { setLocale(l); setOpen(false) }}
                className={`w-full text-left px-3 py-2 text-[12px] transition-colors ${
                  l === locale
                    ? 'bg-blue-500/10 text-blue-400 font-medium'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                {LOCALE_LABELS[l]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
