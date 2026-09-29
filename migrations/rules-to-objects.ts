import { getCliClient } from 'sanity/cli'

interface StructuredRule {
  _key?: string
  _type?: 'rule'
  title: string
  description: string
}

export function splitLegacyRule(value: string): StructuredRule {
  const separator = value.indexOf('-')
  if (separator < 0) {
    return { title: 'Regra', description: value.trim() }
  }

  return {
    title: value.slice(0, separator).trim(),
    description: value.slice(separator + 1).trim(),
  }
}

async function migrateRules() {
  const client = getCliClient({ apiVersion: '2026-01-01' })
  const documents = await client.fetch<
    Array<{ _id: string; rules?: Array<string | StructuredRule> }>
  >('*[_id in ["groupPage", "drafts.groupPage"]]{_id, rules}')

  for (const document of documents) {
    if (!document.rules?.some((item) => typeof item === 'string')) continue

    const rules = document.rules.map((item, index) => {
      if (typeof item !== 'string') return item
      return {
        _key: `rule-${String(index + 1).padStart(2, '0')}`,
        _type: 'rule' as const,
        ...splitLegacyRule(item),
      }
    })

    await client.patch(document._id).set({ rules }).commit()
    console.log(`Regras migradas em ${document._id}`)
  }
}

if (!process.env.VITEST) {
  migrateRules().catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
}
