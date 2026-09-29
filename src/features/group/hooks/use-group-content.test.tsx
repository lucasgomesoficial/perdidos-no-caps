import { act, renderHook } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { normalizeContent } from '../group.mapper'
import { loadGroupContent } from '../group.service'
import type { GroupContent } from '../group.types'
import { useGroupContent } from './use-group-content'

vi.mock('../group.service', () => ({ loadGroupContent: vi.fn() }))
afterEach(() => vi.resetAllMocks())

it('usa conteúdo inicial sem consultar o CMS', () => {
  const initialContent = normalizeContent({ name: 'Conteúdo já carregado' })
  const { result } = renderHook(() => useGroupContent(initialContent))
  expect(result.current.content).toEqual(initialContent)
  expect(loadGroupContent).not.toHaveBeenCalled()
})

it('ignora resposta antiga de uma requisição cancelada pelo StrictMode', async () => {
  const responses: Array<(content: GroupContent) => void> = []
  vi.mocked(loadGroupContent).mockImplementation(
    () => new Promise((resolve) => responses.push(resolve)),
  )
  const { result } = renderHook(() => useGroupContent(), {
    reactStrictMode: true,
  })

  expect(loadGroupContent).toHaveBeenCalledTimes(2)
  expect(vi.mocked(loadGroupContent).mock.calls[0][0].aborted).toBe(true)

  await act(async () => {
    responses[1](normalizeContent({ name: 'Conteúdo atual' }))
  })
  await act(async () => {
    responses[0](normalizeContent({ name: 'Conteúdo antigo' }))
  })

  expect(result.current.content.name).toBe('Conteúdo atual')
})
