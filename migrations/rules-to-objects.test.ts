import { describe, expect, it } from 'vitest'
import { splitLegacyRule } from './rules-to-objects'

describe('migração das regras antigas', () => {
  it('separa título e descrição no primeiro hífen', () => {
    expect(
      splitLegacyRule(
        'NÃO É NÃO - Sem insistência, sem pressão e sem clima estranho.',
      ),
    ).toEqual({
      title: 'NÃO É NÃO',
      description: 'Sem insistência, sem pressão e sem clima estranho.',
    })
  })

  it('aceita regras cadastradas sem espaços ao redor do hífen', () => {
    expect(
      splitLegacyRule('CONTEÚDO SENSÍVEL🔥- Nude somente no privado.'),
    ).toEqual({
      title: 'CONTEÚDO SENSÍVEL🔥',
      description: 'Nude somente no privado.',
    })
  })

  it('preserva uma regra sem separador usando um título neutro', () => {
    expect(splitLegacyRule('Respeite os demais membros.')).toEqual({
      title: 'Regra',
      description: 'Respeite os demais membros.',
    })
  })
})
