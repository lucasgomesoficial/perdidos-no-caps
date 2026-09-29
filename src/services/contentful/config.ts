export const defaultContentfulConfig = {
  space: 'nofz0vh5p7s4',
  environment: 'master',
  entryId: 'perdidos-no-caps',
} as const

type ContentfulEnvironment = Record<string, string | undefined>

export type ContentfulConfig = {
  space: string
  environment: string
  accessToken: string
  entryId: string
}

const identifier = /^[A-Za-z0-9_-]{1,64}$/
const deliveryToken = /^[A-Za-z0-9_-]{10,512}$/

export function resolveContentfulConfig(
  env: ContentfulEnvironment,
): ContentfulConfig | null {
  const space =
    env.VITE_CONTENTFUL_SPACE_ID?.trim() || defaultContentfulConfig.space
  const environment =
    env.VITE_CONTENTFUL_ENVIRONMENT?.trim() ||
    defaultContentfulConfig.environment
  const accessToken = env.VITE_CONTENTFUL_DELIVERY_TOKEN?.trim()
  const entryId =
    env.VITE_CONTENTFUL_GROUP_PAGE_ENTRY_ID?.trim() ||
    defaultContentfulConfig.entryId

  if (
    !identifier.test(space) ||
    !identifier.test(environment) ||
    !accessToken ||
    !deliveryToken.test(accessToken) ||
    !identifier.test(entryId)
  ) {
    return null
  }

  return { space, environment, accessToken, entryId }
}

export function requireContentfulBuildConfig(
  env: ContentfulEnvironment,
): ContentfulConfig {
  const config = resolveContentfulConfig(env)
  if (config) return config

  throw new Error(
    '[Contentful] VITE_CONTENTFUL_DELIVERY_TOKEN ausente ou inválida. Cadastre o token da Content Delivery API no ambiente Production da Vercel.',
  )
}
