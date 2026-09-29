import { describe, expect, it } from 'vitest'
import {
  requireContentfulBuildConfig,
  resolveContentfulConfig,
} from './config'

describe('Contentful config', () => {
  it('uses the public project identifiers when only the delivery token is provided', () => {
    expect(
      resolveContentfulConfig({ VITE_CONTENTFUL_DELIVERY_TOKEN: 'delivery_token_123' }),
    ).toEqual({
      space: 'nofz0vh5p7s4',
      environment: 'master',
      accessToken: 'delivery_token_123',
      entryId: 'perdidos-no-caps',
    })
  })

  it('rejects a production build without a delivery token', () => {
    expect(() => requireContentfulBuildConfig({})).toThrow(
      'VITE_CONTENTFUL_DELIVERY_TOKEN',
    )
  })

  it('rejects malformed values instead of silently disabling requests', () => {
    expect(() =>
      requireContentfulBuildConfig({
        VITE_CONTENTFUL_DELIVERY_TOKEN: '"invalid token"',
      }),
    ).toThrow('inválida')
  })
})
