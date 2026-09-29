import { defaultContent } from './group.defaults'
import type {
  GroupContent,
  GroupEvent,
  GroupImage,
  GroupRule,
} from './group.types'

function text(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function strings(value: unknown, fallback: string[]): string[] {
  return Array.isArray(value)
    ? value
        .filter(
          (item): item is string =>
            typeof item === 'string' && Boolean(item.trim()),
        )
        .map((item) => item.trim())
    : [...fallback]
}

function record(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : undefined
}

function requiredText(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function objects<T>(
  value: unknown,
  normalize: (item: Record<string, unknown>) => T | undefined,
): T[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    const data = record(item)
    if (!data) return []
    const normalized = normalize(data)
    return normalized ? [normalized] : []
  })
}

function rule(value: Record<string, unknown>): GroupRule | undefined {
  const title = requiredText(value.title)
  const description = requiredText(value.description)
  return title && description ? { title, description } : undefined
}

function image(value: unknown): GroupImage | undefined {
  const data = record(value)
  const asset = record(data?.asset)
  const dimensions = record(record(asset?.metadata)?.dimensions)
  const rawUrl = requiredText(asset?.url)
  const width = dimensions?.width
  const height = dimensions?.height

  if (
    !rawUrl ||
    typeof width !== 'number' ||
    typeof height !== 'number' ||
    width <= 0 ||
    height <= 0
  )
    return undefined

  try {
    const url = new URL(rawUrl)
    if (url.protocol !== 'https:' || url.hostname !== 'cdn.sanity.io')
      return undefined
    url.searchParams.set('w', '1200')
    url.searchParams.set('auto', 'format')
    return {
      url: url.href,
      width,
      height,
      alt: requiredText(data?.alt) ?? '',
    }
  } catch {
    return undefined
  }
}

function event(value: Record<string, unknown>): GroupEvent | undefined {
  const title = requiredText(value.title)
  const description = requiredText(value.description)
  if (!title || !description) return undefined
  const normalizedImage = image(value.image)
  return {
    title,
    description,
    ...(normalizedImage ? { image: normalizedImage } : {}),
  }
}

function socialUrl(
  value: unknown,
  network: 'instagram' | 'facebook',
): string | undefined {
  if (typeof value !== 'string') return undefined
  try {
    const url = new URL(value)
    if (
      url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      [network + '.com', 'www.' + network + '.com'].includes(url.hostname)
    )
      return url.href
  } catch {
    /* Campo inválido: não publicar link. */
  }
  return undefined
}

export function normalizeContent(input: unknown): GroupContent {
  const data =
    input && typeof input === 'object' ? (input as Record<string, unknown>) : {}
  return {
    name: text(data.name, defaultContent.name),
    tagline: text(data.tagline, defaultContent.tagline),
    description: text(data.description, defaultContent.description),
    about: text(data.about, defaultContent.about),
    activities: strings(data.activities, defaultContent.activities),
    rules: objects(data.rules, rule),
    events: objects(data.events, event),
    instagram: socialUrl(data.instagram, 'instagram'),
    facebook: socialUrl(data.facebook, 'facebook'),
  }
}
