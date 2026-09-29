import { defineField, defineType } from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Evento',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Imagem',
      type: 'image',
      description:
        'Opcional. Pode ser um banner com informações ou uma imagem complementar.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          description: 'Descreva brevemente o conteúdo visual da imagem.',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description', media: 'image' },
  },
})
