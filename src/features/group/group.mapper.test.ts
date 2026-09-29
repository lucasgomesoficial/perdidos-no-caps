import { describe, expect, it } from 'vitest'
import { normalizeContent } from './group.mapper'

describe('normalização do conteúdo do grupo', () => {
  it('descarta URLs sociais inseguras ou que não sejam da rede indicada', () => {
    const content = normalizeContent({
      fields: {
        instagram: 'javascript:alert(1)',
        facebook: 'https://facebook.com.evil.example',
      },
    })
    expect(content.instagram).toBeUndefined()
    expect(content.facebook).toBeUndefined()
  })

  it('mantém conteúdo básico quando a entrada não existe ou está incompleta', () => {
    expect(normalizeContent(null).name).toBe('Perdidos no CAPS')
    expect(
      normalizeContent({
        fields: {
          name: '   ',
          rules: [
            null,
            {},
            {
              fields: {
                title: ' Respeito ',
                description: ' Trate todos bem. ',
              },
            },
          ],
        },
      }).rules,
    ).toEqual([{ title: 'Respeito', description: 'Trate todos bem.' }])
  })

  it('mantém apenas eventos completos e imagens válidas do Contentful', () => {
    expect(
      normalizeContent({
        fields: {
          events: [
            { fields: { title: ' Evento sem descrição ' } },
            {
              fields: {
                title: ' Café do grupo ',
                description: ' Um encontro para conversar. ',
                imageAlt: ' Pessoas conversando ',
                image: {
                  fields: {
                    file: {
                      url: '//images.ctfassets.net/nofz0vh5p7s4/asset/cafe.jpg',
                      details: { image: { width: 1200, height: 630 } },
                    },
                  },
                },
              },
            },
            {
              fields: {
                title: 'Cinema',
                description: 'Sessão em grupo.',
                image: { fields: {} },
              },
            },
          ],
        },
      }).events,
    ).toEqual([
      {
        title: 'Café do grupo',
        description: 'Um encontro para conversar.',
        image: {
          url: 'https://images.ctfassets.net/nofz0vh5p7s4/asset/cafe.jpg?w=1200&fm=webp',
          width: 1200,
          height: 630,
          alt: 'Pessoas conversando',
        },
      },
      { title: 'Cinema', description: 'Sessão em grupo.' },
    ])
  })

  it('ignora referências ainda não publicadas sem descartar itens válidos', () => {
    const content = normalizeContent({
      fields: {
        rules: [
          {
            fields: { title: ' Respeito ', description: ' Seja gentil. ' },
          },
          { sys: { type: 'Link', linkType: 'Entry', id: 'missing' } },
        ],
        events: [
          {
            fields: {
              title: ' Cinema ',
              description: ' Sessão em grupo. ',
            },
          },
          { sys: { type: 'Link', linkType: 'Entry', id: 'draft-event' } },
        ],
      },
    })
    expect(content.rules).toEqual([
      { title: 'Respeito', description: 'Seja gentil.' },
    ])
    expect(content.events).toEqual([
      { title: 'Cinema', description: 'Sessão em grupo.' },
    ])
  })
})
