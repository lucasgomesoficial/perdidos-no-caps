import { createLegacyManagementClient, isNotFoundError } from './migration-client.mjs'
import source from './source-content.json' with { type: 'json' }
import {
  buildContentTypes,
  buildMigrationPayload,
  readManagementConfig,
} from './migration-core.mjs'

const config = readManagementConfig(process.env)
const client = createLegacyManagementClient(config.accessToken)
const space = await client.getSpace(config.spaceId)
const environment = await space.getEnvironment(config.environmentId)
const locales = await environment.getLocales()
const locale = locales.items.find((item) => item.default)?.code
if (!locale) throw new Error('Contentful environment has no default locale')

async function findOrUndefined(load) {
  try {
    return await load()
  } catch (error) {
    if (isNotFoundError(error)) return undefined
    throw error
  }
}

async function upsertContentType(definition) {
  let contentType = await findOrUndefined(() =>
    environment.getContentType(definition.id),
  )
  if (contentType) {
    contentType.name = definition.name
    contentType.displayField = definition.displayField
    contentType.fields = definition.fields
    contentType = await contentType.update()
  } else {
    contentType = await environment.createContentTypeWithId(definition.id, {
      name: definition.name,
      displayField: definition.displayField,
      fields: definition.fields,
    })
  }
  return contentType.publish()
}

async function upsertEntry(definition) {
  let entry = await findOrUndefined(() => environment.getEntry(definition.id))
  if (entry) {
    entry.fields = definition.fields
    entry = await entry.update()
  } else {
    entry = await environment.createEntryWithId(
      definition.contentType,
      definition.id,
      { fields: definition.fields },
    )
  }
  return entry.publish()
}

function assetFile(asset) {
  const pathname = new URL(asset.url).pathname
  const fileName = decodeURIComponent(pathname.split('/').at(-1) || `${asset.id}.jpg`)
  const extension = fileName.split('.').at(-1)?.toLowerCase()
  const contentType =
    extension === 'png'
      ? 'image/png'
      : extension === 'webp'
        ? 'image/webp'
        : 'image/jpeg'
  return { contentType, fileName, upload: asset.url }
}

async function upsertAsset(definition) {
  let asset = await findOrUndefined(() => environment.getAsset(definition.id))
  if (!asset) {
    asset = await environment.createAssetWithId(definition.id, {
      fields: {
        title: { [locale]: definition.title },
        description: { [locale]: definition.description },
        file: { [locale]: assetFile(definition) },
      },
    })
    asset = await asset.processForAllLocales()
  } else {
    asset.fields.title = { [locale]: definition.title }
    asset.fields.description = { [locale]: definition.description }
    asset = await asset.update()
  }
  return asset.publish()
}

for (const definition of buildContentTypes()) {
  await upsertContentType(definition)
}

const payload = buildMigrationPayload(source, locale)
for (const asset of payload.assets) await upsertAsset(asset)
for (const rule of payload.rules) await upsertEntry(rule)
for (const event of payload.events) await upsertEntry(event)
await upsertEntry(payload.groupPage)

console.log('Migração concluída.')
console.log(`VITE_CONTENTFUL_GROUP_PAGE_ENTRY_ID=${payload.groupPage.id}`)
