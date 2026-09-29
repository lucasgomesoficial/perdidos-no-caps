import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { event } from './sanity/schemaTypes/event'
import { groupPage } from './sanity/schemaTypes/groupPage'
import { rule } from './sanity/schemaTypes/rule'

export default defineConfig({
  name: 'perdidos-no-caps',
  title: 'Perdidos no CAPS',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'configure-project-id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Conteúdo')
          .items([
            S.listItem()
              .title('Página do grupo')
              .id('groupPage')
              .child(
                S.document()
                  .schemaType('groupPage')
                  .documentId('groupPage')
                  .title('Página do grupo'),
              ),
          ]),
    }),
  ],
  schema: {
    types: [groupPage, rule, event],
    templates: (templates) =>
      templates.filter((template) => template.schemaType !== 'groupPage'),
  },
  document: {
    actions: (actions, context) =>
      context.schemaType === 'groupPage'
        ? actions.filter(
            (action) =>
              action.action !== 'duplicate' && action.action !== 'delete',
          )
        : actions,
  },
})
