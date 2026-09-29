import { screen, waitFor } from '@testing-library/react'
import { render } from '@/test/render'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HomePage } from './index'
import { normalizeContent } from '@/features/group/group.mapper'
import { loadGroupContent } from '@/features/group/group.service'

vi.mock('@/features/group/group.service', () => ({ loadGroupContent: vi.fn() }))
afterEach(() => vi.restoreAllMocks())

describe('carregamento do CMS', () => {
  it('atualiza a página quando o conteúdo remoto chega', async () => {
    vi.mocked(loadGroupContent).mockResolvedValue(
      normalizeContent({
        tagline: 'Texto publicado no painel',
        facebook: 'https://www.facebook.com/exemplo',
      }),
    )
    render(<HomePage />)
    expect(
      await screen.findByText('Texto publicado no painel'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /facebook/i })).toHaveAttribute(
      'href',
      'https://www.facebook.com/exemplo',
    )
  })
  it('mantém a apresentação disponível se a API falhar', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.mocked(loadGroupContent).mockRejectedValue(new Error('Sem conexão'))
    render(<HomePage />)
    await waitFor(() => expect(warning).toHaveBeenCalled())
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Perdidos no CAPS',
    )
    expect(
      screen.queryByRole('link', { name: /facebook/i }),
    ).not.toBeInTheDocument()
  })
  it('cancela a requisição quando a página é desmontada', () => {
    vi.mocked(loadGroupContent).mockReturnValue(new Promise(() => {}))
    const view = render(<HomePage />)
    const signal = vi.mocked(loadGroupContent).mock.lastCall![0]
    expect(signal.aborted).toBe(false)
    view.unmount()
    expect(signal.aborted).toBe(true)
  })
})

it('reserva a seção de eventos enquanto o CMS carrega', async () => {
  let resolveContent!: (content: ReturnType<typeof normalizeContent>) => void
  vi.mocked(loadGroupContent).mockReturnValue(
    new Promise((resolve) => {
      resolveContent = resolve
    }),
  )

  render(<HomePage />)
  expect(
    screen.getByRole('status', { name: 'Carregando eventos' }),
  ).toBeInTheDocument()

  resolveContent(
    normalizeContent({
      events: [
        {
          title: 'Festa de Halloween',
          description: 'Venha com a sua fantasia.',
        },
      ],
    }),
  )

  expect(await screen.findByText('Festa de Halloween')).toBeInTheDocument()
  expect(
    screen.queryByRole('status', { name: 'Carregando eventos' }),
  ).not.toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Eventos' })).toHaveAttribute(
    'href',
    '#eventos',
  )
})
