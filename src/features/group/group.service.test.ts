import { afterEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getEntry: vi.fn(),
}))

vi.mock('@/services/contentful/client', () => ({
  contentfulClient: {
    withoutUnresolvableLinks: { getEntry: mocks.getEntry },
  },
  contentfulGroupPageEntryId: 'group-page-entry',
}))

afterEach(() => {
  vi.clearAllMocks()
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('carregamento pelo Contentful', () => {
  it('busca a entrada configurada com referências resolvidas', async () => {
    mocks.getEntry.mockResolvedValue({
      fields: { name: 'Conteúdo publicado' },
    })
    const { loadGroupContent } = await import('./group.service')

    const content = await loadGroupContent(new AbortController().signal)

    expect(mocks.getEntry).toHaveBeenCalledWith('group-page-entry', {
      include: 2,
    })
    expect(content.name).toBe('Conteúdo publicado')
  })

  it('encerra a espera com AbortError quando a tela é desmontada', { timeout: 1000 }, async () => {
    mocks.getEntry.mockReturnValue(new Promise(() => {}))
    const { loadGroupContent } = await import('./group.service')
    const controller = new AbortController()
    const request = loadGroupContent(controller.signal)

    controller.abort()

    await expect(request).rejects.toMatchObject({ name: 'AbortError' })
  })
})
