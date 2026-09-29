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

function fields(value: unknown): Record<string, unknown> | undefined {
  const data = record(value)
  return record(data?.fields) ?? data
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
    const data = fields(item)
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

function optimizedImageUrl(rawUrl: string): string | undefined {
  try {
    const url = new URL(rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl)
    if (url.protocol !== 'https:') return undefined

    if (url.hostname === 'images.ctfassets.net') {
      url.searchParams.set('w', '1200')
      url.searchParams.set('fm', 'webp')
      return url.href
    }
  } catch {
    /* Asset inválido: o evento continua sem imagem. */
  }
  return undefined
}

function image(value: unknown, fallbackAlt = ''): GroupImage | undefined {
  const data = fields(value)
  const file = record(data?.file)
  const dimensions = record(record(file?.details)?.image)
  const rawUrl = requiredText(file?.url)
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

  const url = optimizedImageUrl(rawUrl)
  if (!url) return undefined

  return {
    url,
    width,
    height,
    alt: requiredText(data?.alt) ?? fallbackAlt,
  }
}

function event(value: Record<string, unknown>): GroupEvent | undefined {
  const title = requiredText(value.title)
  const description = requiredText(value.description)
  if (!title || !description) return undefined
  const normalizedImage = image(
    value.image,
    requiredText(value.imageAlt) ?? '',
  )
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
  const data = fields(input) ?? {}
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
