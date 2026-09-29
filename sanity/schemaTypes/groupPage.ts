import { defineField, defineType } from 'sanity'

export const groupPage = defineType({
  name: 'groupPage',
  title: 'Página do grupo',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome do grupo',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Frase de apresentação',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descrição curta',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'about',
      title: 'Sobre o grupo',
      type: 'text',
      rows: 6,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'activities',
      title: 'Tipos de atividades',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'rules',
      title: 'Regras de convivência',
      description:
        'Cadastre as regras oficiais na ordem em que devem aparecer.',
      type: 'array',
      of: [{ type: 'rule' }],
    }),
    defineField({
      name: 'events',
      title: 'Eventos',
      description: 'Cadastre os eventos na ordem em que devem aparecer.',
      type: 'array',
      of: [{ type: 'event' }],
    }),
    ...(['instagram', 'facebook'] as const).map((network) =>
      defineField({
        name: network,
        title: network === 'instagram' ? 'Instagram' : 'Facebook',
        type: 'url',
        description: 'URL pública do perfil oficial. Deixe vazio para ocultar.',
        validation: (rule) =>
          rule.uri({ scheme: ['https'] }).custom((value) => {
            if (!value) return true
            try {
              const url = new URL(value)
              return url.protocol === 'https:' &&
                !url.username &&
                !url.password &&
                [network + '.com', 'www.' + network + '.com'].includes(
                  url.hostname,
                )
                ? true
                : 'Use o endereço HTTPS oficial desta rede social.'
            } catch {
              return 'Informe uma URL válida.'
            }
          }),
      }),
    ),
  ],
  preview: { select: { title: 'name' } },
})
