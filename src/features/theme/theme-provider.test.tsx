import { act, renderHook } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from './theme-provider'
import { useTheme } from './use-theme'

type Listener = (event: MediaQueryListEvent) => void

function installMatchMedia(initialDark = false, modern = true) {
  let matches = initialDark
  const listeners = new Set<Listener>()
  const mediaQuery = {
    get matches() {
      return matches
    },
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: modern
      ? vi.fn((_type: string, listener: Listener) => listeners.add(listener))
      : undefined,
    removeEventListener: modern
      ? vi.fn((_type: string, listener: Listener) => listeners.delete(listener))
      : undefined,
    addListener: vi.fn((listener: Listener) => listeners.add(listener)),
    removeListener: vi.fn((listener: Listener) => listeners.delete(listener)),
    dispatchEvent: vi.fn(),
  } as MediaQueryList

  vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery))

  return {
    change(nextDark: boolean) {
      matches = nextDark
      listeners.forEach((listener) =>
        listener({ matches: nextDark } as MediaQueryListEvent),
      )
    },
  }
}

function wrapper({ children }: PropsWithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  installMatchMedia(false)
})

afterEach(() => vi.restoreAllMocks())

describe('ThemeProvider', () => {
  it('usa o sistema por padrão e acompanha sua mudança', () => {
    const media = installMatchMedia(false)
    const { result } = renderHook(() => useTheme(), { wrapper })

    expect(result.current.preference).toBe('system')
    expect(result.current.resolvedTheme).toBe('light')
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')

    act(() => media.change(true))

    expect(result.current.resolvedTheme).toBe('dark')
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  })

  it('restaura uma preferência válida e ignora mudanças do sistema', () => {
    localStorage.setItem('perdidos-no-caps-theme', 'dark')
    const media = installMatchMedia(false)
    const { result } = renderHook(() => useTheme(), { wrapper })

    expect(result.current.preference).toBe('dark')
    expect(result.current.resolvedTheme).toBe('dark')

    act(() => media.change(true))
    expect(result.current.resolvedTheme).toBe('dark')
  })

  it('ignora valor armazenado inválido', () => {
    localStorage.setItem('perdidos-no-caps-theme', 'sepia')
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.preference).toBe('system')
  })

  it('persiste escolhas e não deixa atributos conflitantes', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })

    act(() => result.current.setPreference('dark'))
    act(() => result.current.setPreference('light'))

    expect(localStorage.getItem('perdidos-no-caps-theme')).toBe('light')
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(document.documentElement).not.toHaveAttribute('data-theme', 'dark')
  })

  it('continua funcionando quando o armazenamento lança erro', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage indisponível')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage indisponível')
    })

    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.preference).toBe('system')
    expect(() => {
      act(() => result.current.setPreference('dark'))
    }).not.toThrow()
    expect(result.current.resolvedTheme).toBe('dark')
  })

  it('usa a API legada do media query quando necessário', () => {
    const media = installMatchMedia(false, false)
    const { result } = renderHook(() => useTheme(), { wrapper })

    act(() => media.change(true))
    expect(result.current.resolvedTheme).toBe('dark')
  })
})

it('monta quando o acesso à propriedade localStorage é bloqueado', () => {
  const descriptor = Object.getOwnPropertyDescriptor(window, 'localStorage')
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    get() {
      throw new Error('acesso bloqueado')
    },
  })

  try {
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.preference).toBe('system')
    expect(() => {
      act(() => result.current.setPreference('dark'))
    }).not.toThrow()
  } finally {
    if (descriptor) Object.defineProperty(window, 'localStorage', descriptor)
  }
})
