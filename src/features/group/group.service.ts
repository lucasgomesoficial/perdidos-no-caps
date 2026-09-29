import {
  contentfulClient,
  contentfulGroupPageEntryId,
} from '@/services/contentful/client'
import { normalizeContent } from './group.mapper'
import type { GroupContent } from './group.types'

function abortError(): DOMException {
  return new DOMException('The operation was aborted.', 'AbortError')
}

function waitForRequest<T>(request: Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) return Promise.reject(abortError())

  return new Promise((resolve, reject) => {
    const onAbort = () => reject(abortError())
    signal.addEventListener('abort', onAbort, { once: true })

    request.then(resolve, reject).finally(() => {
      signal.removeEventListener('abort', onAbort)
    })
  })
}

export async function loadGroupContent(
  signal: AbortSignal,
): Promise<GroupContent> {
  if (!contentfulClient || !contentfulGroupPageEntryId)
    return normalizeContent(null)
  if (signal.aborted) throw abortError()

  const request = contentfulClient.withoutUnresolvableLinks.getEntry(
    contentfulGroupPageEntryId,
    { include: 2 },
  )
  const data = await waitForRequest(request, signal)
  return normalizeContent(data)
}
