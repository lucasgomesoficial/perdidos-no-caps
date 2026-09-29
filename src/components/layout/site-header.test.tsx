import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { ThemeProvider } from '@/features/theme/theme-provider'
import { SiteHeader } from './site-header'

beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
})

function renderHeader() {
  render(
    <ThemeProvider>
      <SiteHeader
        name="Perdidos no CAPS"
        homeHref="#inicio"
        navigation={[{ label: 'O grupo', href: '#sobre' }]}
      />
    </ThemeProvider>,
  )
}

it('abre e fecha o menu móvel pelo mesmo botão', () => {
  renderHeader()

  const openButton = screen.getByRole('button', { name: 'Abrir menu' })
  expect(openButton).toHaveAttribute('aria-expanded', 'false')
  expect(
    screen.queryByRole('navigation', { name: 'Navegação principal' }),
  ).not.toBeInTheDocument()

  fireEvent.click(openButton)

  const closeButton = screen.getByRole('button', { name: 'Fechar menu' })
  expect(closeButton).toHaveAttribute('aria-expanded', 'true')
  expect(
    screen.getByRole('navigation', { name: 'Navegação principal' }),
  ).toBeInTheDocument()

  fireEvent.click(closeButton)
  expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute(
    'aria-expanded',
    'false',
  )
})

it('fecha o painel depois que um link é escolhido', () => {
  renderHeader()
  fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))
  fireEvent.click(screen.getByRole('link', { name: 'O grupo' }))

  expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute(
    'aria-expanded',
    'false',
  )
})

it('fecha o painel ao tocar fora do cabeçalho', () => {
  renderHeader()
  fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))

  fireEvent.pointerDown(document.body)

  expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute(
    'aria-expanded',
    'false',
  )
})
