import { render as testingLibraryRender } from '@testing-library/react'
import type { ReactElement } from 'react'
import { ThemeProvider } from '@/features/theme/theme-provider'

export function render(ui: ReactElement) {
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: (query: string) => ({
        matches: query === '(min-width: 768px)',
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
      }),
    })
  }
  return testingLibraryRender(<ThemeProvider>{ui}</ThemeProvider>)
}
