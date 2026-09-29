import type { ThemePreference } from './theme.types'

export const THEME_STORAGE_KEY = 'perdidos-no-caps-theme'

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark'
}

export function readThemePreference(storage: Storage): ThemePreference {
  try {
    const value = storage.getItem(THEME_STORAGE_KEY)
    return isThemePreference(value) ? value : 'system'
  } catch {
    return 'system'
  }
}

export function writeThemePreference(storage: Storage, value: ThemePreference) {
  try {
    storage.setItem(THEME_STORAGE_KEY, value)
  } catch {
    // O tema continua funcionando durante a sessão sem persistência.
  }
}
