import { expect, it, vi } from 'vitest'
import { createLegacyManagementClient } from './migration-client.mjs'

it('solicita explicitamente a interface legada suportada pelo executor', () => {
  const factory = vi.fn(() => ({ getSpace: vi.fn() }))

  const client = createLegacyManagementClient('secret', factory)

  expect(factory).toHaveBeenCalledWith(
    { accessToken: 'secret' },
    { type: 'legacy' },
  )
  expect(client.getSpace).toBeTypeOf('function')
})

it('reconhece o erro NotFound emitido pelo SDK legado', async () => {
  const module = await import('./migration-client.mjs')
  expect(module.isNotFoundError(Object.assign(new Error(), { name: 'NotFound' }))).toBe(true)
  expect(module.isNotFoundError({ status: 404 })).toBe(true)
  expect(module.isNotFoundError(new Error('network'))).toBe(false)
})

it('identifica asset existente que ainda não terminou o processamento', async () => {
  const module = await import('./migration-client.mjs')
  expect(
    module.assetNeedsProcessing(
      { fields: { file: { 'pt-BR': { upload: 'https://example.com/a.png' } } } },
      'pt-BR',
    ),
  ).toBe(true)
  expect(
    module.assetNeedsProcessing(
      { fields: { file: { 'pt-BR': { url: '//images.ctfassets.net/a.png' } } } },
      'pt-BR',
    ),
  ).toBe(false)
})
