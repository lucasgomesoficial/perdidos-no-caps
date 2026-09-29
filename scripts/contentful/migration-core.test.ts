import { describe, expect, it } from 'vitest'
import source from './source-content.json'
import {
  buildContentTypes,
  buildMigrationPayload,
  readManagementConfig,
  stableResourceId,
} from './migration-core.mjs'

describe('núcleo da migração Contentful', () => {
  it('gera identificadores determinísticos e válidos', () => {
    const first = stableResourceId('rule', 'NÃO É NÃO')
    expect(first).toBe(stableResourceId('rule', 'NÃO É NÃO'))
    expect(first).not.toBe(stableResourceId('rule', 'Outra regra'))
    expect(first).toMatch(/^[a-z0-9-]{1,64}$/)
  })

  it('define os três modelos com campos e referências restritos', () => {
    const definitions = buildContentTypes()
    expect(definitions.map((item) => item.id)).toEqual([
      'groupRule',
      'groupEvent',
      'groupPage',
    ])
    const page = definitions.find((item) => item.id === 'groupPage')!
    expect(page.fields.find((field) => field.id === 'name')?.required).toBe(true)
    expect(page.fields.find((field) => field.id === 'rules')).toMatchObject({
      type: 'Array',
      items: {
        type: 'Link',
        linkType: 'Entry',
        validations: [{ linkContentType: ['groupRule'] }],
      },
    })
    expect(page.fields.find((field) => field.id === 'events')).toMatchObject({
      items: { validations: [{ linkContentType: ['groupEvent'] }] },
    })
  })

  it('preserva a ordem e cria links localizados para regras, eventos e imagem', () => {
    const payload = buildMigrationPayload(source, 'pt-BR')
    expect(payload.groupPage.id).toBe('perdidos-no-caps')
    expect(payload.rules).toHaveLength(11)
    expect(payload.events).toHaveLength(1)
    expect(payload.assets).toHaveLength(1)
    expect(payload.groupPage.fields.rules['pt-BR']).toEqual(
      payload.rules.map((rule) => ({
        sys: { type: 'Link', linkType: 'Entry', id: rule.id },
      })),
    )
    expect(payload.groupPage.fields.events['pt-BR'][0].sys.id).toBe(
      payload.events[0].id,
    )
    expect(payload.events[0].fields.image['pt-BR'].sys.id).toBe(
      payload.assets[0].id,
    )
  })

  it('recusa executar sem credencial de gerenciamento', () => {
    expect(() =>
      readManagementConfig({ CONTENTFUL_SPACE_ID: 'nofz0vh5p7s4' }),
    ).toThrow('CONTENTFUL_MANAGEMENT_TOKEN')
  })
})
