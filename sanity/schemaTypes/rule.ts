import { defineField, defineType } from 'sanity'

export const rule = defineType({
  name: 'rule',
  title: 'Regra',
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
  ],
  preview: { select: { title: 'title', subtitle: 'description' } },
})
