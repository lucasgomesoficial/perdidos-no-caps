import { createClient } from 'contentful-management'

export function createLegacyManagementClient(accessToken, factory = createClient) {
  return factory({ accessToken }, { type: 'legacy' })
}

export function isNotFoundError(error) {
  return (
    error?.name === 'NotFound' ||
    error?.status === 404 ||
    error?.response?.status === 404
  )
}
