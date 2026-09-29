import { createClient } from 'contentful'

const space = import.meta.env.VITE_CONTENTFUL_SPACE_ID?.trim()
const environment =
  import.meta.env.VITE_CONTENTFUL_ENVIRONMENT?.trim() || 'master'
const accessToken = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN?.trim()
const entryId = import.meta.env.VITE_CONTENTFUL_GROUP_PAGE_ENTRY_ID?.trim()
const identifier = /^[A-Za-z0-9_-]+$/
const validConfig =
  space &&
  identifier.test(space) &&
  identifier.test(environment) &&
  accessToken &&
  entryId &&
  identifier.test(entryId)

export const contentfulGroupPageEntryId = validConfig ? entryId : undefined

export const contentfulClient = validConfig
  ? createClient({ space, environment, accessToken })
  : null
