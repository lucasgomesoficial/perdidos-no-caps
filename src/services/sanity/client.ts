import { createClient } from '@sanity/client'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID?.trim()
const dataset = import.meta.env.VITE_SANITY_DATASET?.trim() || 'production'
const validConfig =
  projectId && /^[a-z0-9-]+$/.test(projectId) && /^[a-z0-9_-]+$/.test(dataset)
export const sanityClient = (() => {
  if (!validConfig) return null
  try {
    return createClient({
      projectId,
      dataset,
      apiVersion: '2026-01-01',
      useCdn: true,
      perspective: 'published',
      timeout: 8000,
      maxRetries: 1,
    })
  } catch {
    // Configuração inválida não deve impedir a apresentação local.
    return null
  }
})()
