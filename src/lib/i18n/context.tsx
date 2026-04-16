'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations, type Locale, type TranslationKey, type TranslationSubKey } from './translations'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: <K extends TranslationKey>(section: K, key: TranslationSubKey<K>) => string
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: () => '',
})

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null
    if (saved && ['en', 'ru', 'ky'].includes(saved)) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('locale', l)
  }, [])

  const t = useCallback(<K extends TranslationKey>(section: K, key: TranslationSubKey<K>): string => {
    const sectionData = translations[section]
    if (!sectionData) return String(key)
    const entry = (sectionData as Record<string, Record<string, string>>)[key as string]
    if (!entry) return String(key)
    return entry[locale] || entry['en'] || String(key)
  }, [locale])

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
