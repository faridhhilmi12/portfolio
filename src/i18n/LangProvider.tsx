import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { readStore, writeStore } from '../lib/storage'
import { id, type MessageKey } from './id'
import { en } from './en'

export type Lang = 'id' | 'en'

const DICTS: Record<Lang, Record<MessageKey, string>> = { id, en }

interface LangContextValue {
  lang: Lang
  setLang(l: Lang): void
}

const LangContext = createContext<LangContextValue | null>(null)

function initialLang(): Lang {
  const saved = readStore('lang')
  if (saved === 'id' || saved === 'en') return saved
  return (navigator.language || 'id').toLowerCase().startsWith('id') ? 'id' : 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    writeStore('lang', l)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = DICTS[lang]['meta.title']
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (meta) meta.content = DICTS[lang]['meta.desc']
  }, [lang])

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}

export function useT(): (key: MessageKey) => string {
  const { lang } = useLang()
  return useCallback((key: MessageKey) => DICTS[lang][key], [lang])
}
