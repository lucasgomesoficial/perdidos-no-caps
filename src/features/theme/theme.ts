import type { ResolvedTheme, ThemePreference } from './theme.types'

export const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)'

export function resolveTheme(
  preference: ThemePreference,
  systemIsDark: boolean,
): ResolvedTheme {
  if (preference === 'system') return systemIsDark ? 'dark' : 'light'
  return preference
}

export function applyTheme(theme: ResolvedTheme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
}
