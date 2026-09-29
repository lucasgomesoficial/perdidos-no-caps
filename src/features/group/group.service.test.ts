import { afterEach, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

it.each(['_production', 'a'.repeat(65)])(
  'usa conteúdo local com dataset inválido: %s',
  async (dataset) => {
    vi.stubEnv('VITE_SANITY_PROJECT_ID', 'abc12345')
    vi.stubEnv('VITE_SANITY_DATASET', dataset)
    vi.resetModules()
    const { loadGroupContent } = await import('./group.service')
    expect((await loadGroupContent(new AbortController().signal)).name).toBe(
      'Perdidos no CAPS',
    )
  },
)
