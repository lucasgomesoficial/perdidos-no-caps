import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { ThemeProvider } from './theme-provider'
import { ThemeSwitcher } from './theme-switcher'

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
})

it('oferece as três preferências e indica a opção selecionada', () => {
  render(
    <ThemeProvider>
      <ThemeSwitcher />
    </ThemeProvider>,
  )

  expect(screen.getByRole('group', { name: 'Aparência' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Sistema' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )

  fireEvent.click(screen.getByRole('button', { name: 'Escuro' }))

  expect(screen.getByRole('button', { name: 'Escuro' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  expect(localStorage.getItem('perdidos-no-caps-theme')).toBe('dark')
})
