'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import i18n from 'i18next'
import { initReactI18next, useTranslation as useI18nTranslation } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import enTranslations from '@/i18n/locales/en.json'
import siTranslations from '@/i18n/locales/si.json'

// Initialize i18next
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      debug: process.env.NODE_ENV === 'development',
      load: 'languageOnly',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      resources: {
        en: { translation: enTranslations },
        si: { translation: siTranslations },
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
      },
      react: {
        useSuspense: false,
      },
    })
}

interface I18nContextType {
  language: string
  changeLanguage: (lang: string) => void
  t: (key: string, options?: Record<string, unknown>) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<string>('en')
  // const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Get the language from localStorage or use detected language
    const savedLng = typeof window !== 'undefined' 
      ? localStorage.getItem('i18nextLng') 
      : null
    
    const detectedLng = savedLng || i18n.language || 'en'
    setLanguage(detectedLng)
    
    // Only change language if different from current
    if (i18n.language !== detectedLng) {
      i18n.changeLanguage(detectedLng)
    }

    const handleLanguageChange = (lng: string) => {
      setLanguage(lng)
    }

    i18n.on('languageChanged', handleLanguageChange)

    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [])

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', lang)
      localStorage.setItem('hasSelectedLanguage', 'true')
    }
  }

  const t = (key: string, options?: Record<string, unknown>): string => {
    return i18n.t(key, options) as string
  }

  return (
    <I18nContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

// Re-export useTranslation for components that need full i18next hooks
export { useI18nTranslation as useTranslation }
