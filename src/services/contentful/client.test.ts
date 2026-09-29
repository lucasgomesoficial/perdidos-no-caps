import { afterEach, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ createClient: vi.fn(() => ({ id: 'client' })) }))
vi.mock('contentful', () => ({ createClient: mocks.createClient }))

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
  mocks.createClient.mockClear()
})

it('não cria cliente quando a configuração pública está incompleta', async () => {
  vi.stubEnv('VITE_CONTENTFUL_SPACE_ID', 'nofz0vh5p7s4')
  vi.stubEnv('VITE_CONTENTFUL_ENVIRONMENT', 'master')
  vi.stubEnv('VITE_CONTENTFUL_DELIVERY_TOKEN', '')
  vi.stubEnv('VITE_CONTENTFUL_GROUP_PAGE_ENTRY_ID', '')

  const configuration = await import('./client')

  expect(configuration.contentfulClient).toBeNull()
  expect(configuration.contentfulGroupPageEntryId).toBeUndefined()
  expect(mocks.createClient).not.toHaveBeenCalled()
})

it('cria cliente para uma configuração pública completa', async () => {
  vi.stubEnv('VITE_CONTENTFUL_SPACE_ID', 'nofz0vh5p7s4')
  vi.stubEnv('VITE_CONTENTFUL_ENVIRONMENT', 'master')
  vi.stubEnv('VITE_CONTENTFUL_DELIVERY_TOKEN', 'delivery-token')
  vi.stubEnv('VITE_CONTENTFUL_GROUP_PAGE_ENTRY_ID', 'group-page-entry')

  const configuration = await import('./client')

  expect(mocks.createClient).toHaveBeenCalledWith({
    space: 'nofz0vh5p7s4',
    environment: 'master',
    accessToken: 'delivery-token',
  })
  expect(configuration.contentfulGroupPageEntryId).toBe('group-page-entry')
})

it.each([
  ['token com espaço', 'delivery token inválido', 'group-page-entry'],
  ['Entry ID acima do limite', 'delivery-token', 'a'.repeat(65)],
])('rejeita configuração pública malformada: %s', async (_, token, entryId) => {
  vi.stubEnv('VITE_CONTENTFUL_SPACE_ID', 'nofz0vh5p7s4')
  vi.stubEnv('VITE_CONTENTFUL_ENVIRONMENT', 'master')
  vi.stubEnv('VITE_CONTENTFUL_DELIVERY_TOKEN', token)
  vi.stubEnv('VITE_CONTENTFUL_GROUP_PAGE_ENTRY_ID', entryId)

  const configuration = await import('./client')

  expect(configuration.contentfulClient).toBeNull()
  expect(mocks.createClient).not.toHaveBeenCalled()
})
