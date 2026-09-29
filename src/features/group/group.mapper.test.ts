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

it('normaliza uma entrada resolvida do Contentful e ignora referências pendentes', () => {
  expect(
    normalizeContent({
      sys: { id: 'group-page', type: 'Entry' },
      fields: {
        name: ' Perdidos no CAPS ',
        tagline: ' Uma turma para pertencer ',
        description: ' Descrição pública ',
        about: ' Sobre o grupo ',
        activities: [' Conversas ', '', ' Passeios '],
        rules: [
          {
            sys: { id: 'rule-1', type: 'Entry' },
            fields: {
              title: ' Respeito ',
              description: ' Trate todas as pessoas bem. ',
            },
          },
          { sys: { type: 'Link', linkType: 'Entry', id: 'draft-rule' } },
        ],
        events: [
          {
            sys: { id: 'event-1', type: 'Entry' },
            fields: {
              title: ' Café do grupo ',
              description: ' Um encontro para conversar. ',
              imageAlt: ' Pessoas conversando ',
              image: {
                sys: { id: 'asset-1', type: 'Asset' },
                fields: {
                  file: {
                    url: '//images.ctfassets.net/nofz0vh5p7s4/asset/evento.jpg',
                    details: { image: { width: 1600, height: 900 } },
                  },
                },
              },
            },
          },
          {
            sys: { id: 'event-2', type: 'Entry' },
            fields: {
              title: ' Cinema ',
              description: ' Sessão em grupo. ',
              image: {
                fields: {
                  file: {
                    url: '//example.com/insegura.jpg',
                    details: { image: { width: 800, height: 600 } },
                  },
                },
              },
            },
          },
          { sys: { type: 'Link', linkType: 'Entry', id: 'draft-event' } },
        ],
        instagram: 'https://instagram.com/perdidosnocapsrp',
      },
    }).events,
  ).toEqual([
    {
      title: 'Café do grupo',
      description: 'Um encontro para conversar.',
      image: {
        url: 'https://images.ctfassets.net/nofz0vh5p7s4/asset/evento.jpg?w=1200&fm=webp',
        width: 1600,
        height: 900,
        alt: 'Pessoas conversando',
      },
    },
    { title: 'Cinema', description: 'Sessão em grupo.' },
  ])

  const content = normalizeContent({
    fields: {
      rules: [
        {
          fields: { title: ' Respeito ', description: ' Seja gentil. ' },
        },
        { sys: { type: 'Link', linkType: 'Entry', id: 'missing' } },
      ],
    },
  })
  expect(content.rules).toEqual([
    { title: 'Respeito', description: 'Seja gentil.' },
  ])
})
