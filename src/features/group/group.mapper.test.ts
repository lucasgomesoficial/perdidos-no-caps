import { describe, expect, it } from 'vitest'
import { normalizeContent } from './group.mapper'

describe('normalização do conteúdo do grupo', () => {
  it('descarta URLs inseguras ou que não sejam da rede indicada', () => {
    const content = normalizeContent({
      instagram: 'javascript:alert(1)',
      facebook: 'https://facebook.com.evil.example',
    })
    expect(content.instagram).toBeUndefined()
    expect(content.facebook).toBeUndefined()
  })
  it('mantém conteúdo básico quando o documento não existe ou está incompleto', () => {
    expect(normalizeContent(null).name).toBe('Perdidos no CAPS')
    expect(
      normalizeContent({
        name: '   ',
        rules: [
          null,
          {},
          { title: ' Respeito ', description: ' Trate todos bem. ' },
        ],
      }).rules,
    ).toEqual([{ title: 'Respeito', description: 'Trate todos bem.' }])
    expect(normalizeContent({ name: '   ' }).name).toBe('Perdidos no CAPS')
  })

  it('mantém apenas eventos completos e imagens válidas', () => {
    expect(
      normalizeContent({
        events: [
          { title: ' Evento sem descrição ' },
          {
            title: ' Café do grupo ',
            description: ' Um encontro para conversar. ',
            image: {
              _type: 'image',
              asset: {
                _ref: 'image-abc-1200x630-jpg',
                url: 'https://cdn.sanity.io/images/khxz4stb/production/abc-1200x630.jpg',
                metadata: { dimensions: { width: 1200, height: 630 } },
              },
              alt: ' Pessoas conversando ',
            },
          },
          {
            title: 'Cinema',
            description: 'Sessão em grupo.',
            image: { _type: 'image', asset: {} },
          },
        ],
      }).events,
    ).toEqual([
      {
        title: 'Café do grupo',
        description: 'Um encontro para conversar.',
        image: {
          url: 'https://cdn.sanity.io/images/khxz4stb/production/abc-1200x630.jpg?w=1200&auto=format',
          width: 1200,
          height: 630,
          alt: 'Pessoas conversando',
        },
      },
      { title: 'Cinema', description: 'Sessão em grupo.' },
    ])
  })
})
