import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ThemeContext } from './theme-context'
import { readThemePreference, writeThemePreference } from './theme.storage'
import { applyTheme, resolveTheme, THEME_MEDIA_QUERY } from './theme'
import type { ThemePreference } from './theme.types'

function readInitialPreference(): ThemePreference {
  try {
    return readThemePreference(window.localStorage)
  } catch {
    return 'system'
  }
}

function persistPreference(value: ThemePreference) {
  try {
    writeThemePreference(window.localStorage, value)
  } catch {
    // O acesso à propriedade localStorage também pode ser bloqueado.
  }
}

function systemPrefersDark() {
  return window.matchMedia?.(THEME_MEDIA_QUERY).matches ?? false
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [preference, setPreferenceState] = useState<ThemePreference>(readInitialPreference)
  const [systemIsDark, setSystemIsDark] = useState(systemPrefersDark)
  const resolvedTheme = resolveTheme(preference, systemIsDark)

  useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  useEffect(() => {
    if (preference !== 'system' || !window.matchMedia) return

    const media = window.matchMedia(THEME_MEDIA_QUERY)
    const updateTheme = (event: MediaQueryListEvent) =>
      setSystemIsDark(event.matches)

    setSystemIsDark(media.matches)
    if (media.addEventListener) {
      media.addEventListener('change', updateTheme)
      return () => media.removeEventListener('change', updateTheme)
    }

    media.addListener?.(updateTheme)
    return () => media.removeListener?.(updateTheme)
  }, [preference])

  const setPreference = useCallback((value: ThemePreference) => {
    setPreferenceState(value)
    persistPreference(value)
  }, [])

  const value = useMemo(
    () => ({ preference, resolvedTheme, setPreference }),
    [preference, resolvedTheme, setPreference],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
