const identifierPart = (value) =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 44) || 'item'

const hash = (value) => {
  let result = 2166136261
  for (const character of String(value)) {
    result ^= character.codePointAt(0)
    result = Math.imul(result, 16777619)
  }
  return (result >>> 0).toString(36)
}

export function stableResourceId(prefix, value) {
  return `${identifierPart(prefix)}-${identifierPart(value)}-${hash(value)}`.slice(
    0,
    64,
  )
}

const shortText = (id, name, required = false) => ({
  id,
  name,
  type: 'Symbol',
  localized: false,
  required,
  validations: [],
  disabled: false,
  omitted: false,
})

const longText = (id, name, required = false) => ({
  ...shortText(id, name, required),
  type: 'Text',
})

const referenceList = (id, name, contentType) => ({
  id,
  name,
  type: 'Array',
  localized: false,
  required: false,
  validations: [],
  disabled: false,
  omitted: false,
  items: {
    type: 'Link',
    linkType: 'Entry',
    validations: [{ linkContentType: [contentType] }],
  },
})

export function buildContentTypes() {
  return [
    {
      id: 'groupRule',
      name: 'Regra do grupo',
      displayField: 'title',
      fields: [
        shortText('title', 'Título', true),
        longText('description', 'Descrição', true),
      ],
    },
    {
      id: 'groupEvent',
      name: 'Evento do grupo',
      displayField: 'title',
      fields: [
        shortText('title', 'Título', true),
        longText('description', 'Descrição', true),
        {
          id: 'image',
          name: 'Imagem',
          type: 'Link',
          linkType: 'Asset',
          localized: false,
          required: false,
          validations: [{ linkMimetypeGroup: ['image'] }],
          disabled: false,
          omitted: false,
        },
        shortText('imageAlt', 'Texto alternativo'),
      ],
    },
    {
      id: 'groupPage',
      name: 'Página do grupo',
      displayField: 'name',
      fields: [
        shortText('name', 'Nome', true),
        shortText('tagline', 'Chamada', true),
        longText('description', 'Descrição', true),
        longText('about', 'Sobre', true),
        {
          id: 'activities',
          name: 'Atividades',
          type: 'Array',
          localized: false,
          required: false,
          validations: [],
          disabled: false,
          omitted: false,
          items: { type: 'Symbol', validations: [] },
        },
        referenceList('rules', 'Regras', 'groupRule'),
        referenceList('events', 'Eventos', 'groupEvent'),
        shortText('instagram', 'Instagram'),
        shortText('facebook', 'Facebook'),
      ],
    },
  ]
}

const localized = (locale, value) => ({ [locale]: value })
const entryLink = (id) => ({ sys: { type: 'Link', linkType: 'Entry', id } })
const assetLink = (id) => ({ sys: { type: 'Link', linkType: 'Asset', id } })

export function buildMigrationPayload(source, locale) {
  const rules = (source.rules ?? []).map((rule) => ({
    id: stableResourceId('rule', rule.title),
    contentType: 'groupRule',
    fields: {
      title: localized(locale, rule.title),
      description: localized(locale, rule.description),
    },
  }))

  const assets = []
  const events = (source.events ?? []).map((event) => {
    const id = stableResourceId('event', event.title)
    const imageUrl = event.image?.asset?.url
    const assetId = imageUrl ? stableResourceId('asset', imageUrl) : undefined
    if (assetId) {
      assets.push({
        id: assetId,
        title: event.image.alt || event.title,
        description: event.image.alt || '',
        url: imageUrl,
      })
    }
    return {
      id,
      contentType: 'groupEvent',
      fields: {
        title: localized(locale, event.title),
        description: localized(locale, event.description),
        ...(assetId ? { image: localized(locale, assetLink(assetId)) } : {}),
        ...(event.image?.alt
          ? { imageAlt: localized(locale, event.image.alt) }
          : {}),
      },
    }
  })

  const pageFields = {
    name: localized(locale, source.name),
    tagline: localized(locale, source.tagline),
    description: localized(locale, source.description),
    about: localized(locale, source.about),
    activities: localized(locale, source.activities ?? []),
    rules: localized(
      locale,
      rules.map((rule) => entryLink(rule.id)),
    ),
    events: localized(
      locale,
      events.map((event) => entryLink(event.id)),
    ),
    ...(source.instagram
      ? { instagram: localized(locale, source.instagram) }
      : {}),
    ...(source.facebook ? { facebook: localized(locale, source.facebook) } : {}),
  }

  return {
    rules,
    events,
    assets,
    groupPage: {
      id: 'perdidos-no-caps',
      contentType: 'groupPage',
      fields: pageFields,
    },
  }
}

export function readManagementConfig(environment) {
  const accessToken = environment.CONTENTFUL_MANAGEMENT_TOKEN?.trim()
  if (!accessToken) throw new Error('CONTENTFUL_MANAGEMENT_TOKEN is required')
  return {
    accessToken,
    spaceId: environment.CONTENTFUL_SPACE_ID?.trim() || 'nofz0vh5p7s4',
    environmentId: environment.CONTENTFUL_ENVIRONMENT?.trim() || 'master',
  }
}
