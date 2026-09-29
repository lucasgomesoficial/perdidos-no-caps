import { createClient } from 'contentful'
import { resolveContentfulConfig } from './config'

const config = resolveContentfulConfig(import.meta.env)

export const contentfulGroupPageEntryId = config?.entryId

export const contentfulClient = config
  ? createClient({
      space: config.space,
      environment: config.environment,
      accessToken: config.accessToken,
    })
  : null
