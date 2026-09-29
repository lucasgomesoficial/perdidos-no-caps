import { useEffect, useState } from 'react'
import { defaultContent } from '../group.defaults'
import { loadGroupContent } from '../group.service'
import type { GroupContent } from '../group.types'

export function useGroupContent(initialContent?: GroupContent) {
  const [content, setContent] = useState(initialContent ?? defaultContent)
  const [isLoading, setIsLoading] = useState(!initialContent)

  useEffect(() => {
    if (initialContent) return

    const controller = new AbortController()

    loadGroupContent(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setContent(data)
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted && import.meta.env.DEV) {
          console.warn(
            'Conteúdo remoto indisponível; usando apresentação local.',
            error,
          )
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [initialContent])

  return { content, isLoading }
}
