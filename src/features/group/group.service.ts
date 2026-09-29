import { sanityClient } from '@/services/sanity/client'
import { normalizeContent } from './group.mapper'
import type { GroupContent } from './group.types'

const GROUP_PAGE_QUERY = `
  *[_type == "groupPage" && _id == "groupPage"][0] {
    name,
    tagline,
    description,
    about,
    activities,
    rules[]{title, description},
    events[]{
      title,
      description,
      image{
        alt,
        asset->{url, metadata{dimensions}}
      }
    },
    instagram,
    facebook
  }
`

export async function loadGroupContent(
  signal: AbortSignal,
): Promise<GroupContent> {
  if (!sanityClient) return normalizeContent(null)

  const data = await sanityClient.fetch<unknown>(
    GROUP_PAGE_QUERY,
    {},
    { signal },
  )
  return normalizeContent(data)
}
