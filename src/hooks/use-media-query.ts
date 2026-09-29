import { useEffect, useState } from 'react'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => window.matchMedia?.(query).matches ?? false,
  )

  useEffect(() => {
    if (!window.matchMedia) return
    const media = window.matchMedia(query)
    const update = (event: MediaQueryListEvent) => setMatches(event.matches)

    setMatches(media.matches)
    if (media.addEventListener) {
      media.addEventListener('change', update)
      return () => media.removeEventListener('change', update)
    }
    media.addListener?.(update)
    return () => media.removeListener?.(update)
  }, [query])

  return matches
}
