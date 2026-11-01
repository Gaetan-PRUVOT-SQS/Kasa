export interface Host {
  name: string
  picture: string
}

export interface Property {
  id: string
  title: string
  cover: string
  pictures: string[]
  description: string
  host: Host
  rating: string
  location: string
  equipments: string[]
  tags: string[]
}

interface ApiEnv {
  VITE_API_URL?: string
  DEV: boolean
}

export function resolveApiBase(env: ApiEnv): string {
  if (env.VITE_API_URL !== undefined) {
    return env.VITE_API_URL
  }
  if (env.DEV) {
    return ''
  }
  return 'http://localhost:8080'
}

const API_BASE = resolveApiBase(import.meta.env)

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

async function readJson(response: Response): Promise<unknown> {
  return (await response.json()) as unknown
}

export function isProperty(value: unknown): value is Property {
  if (!isRecord(value) || !isRecord(value.host)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.cover === 'string' &&
    isStringArray(value.pictures) &&
    typeof value.description === 'string' &&
    typeof value.host.name === 'string' &&
    typeof value.host.picture === 'string' &&
    typeof value.rating === 'string' &&
    typeof value.location === 'string' &&
    isStringArray(value.equipments) &&
    isStringArray(value.tags)
  )
}

function isPropertyList(value: unknown): value is Property[] {
  if (!Array.isArray(value)) {
    return false
  }
  for (const item of value as readonly unknown[]) {
    if (!isProperty(item)) {
      return false
    }
  }
  return true
}

export async function getProperties(): Promise<Property[]> {
  const response = await fetch(`${API_BASE}/api/properties`)

  if (!response.ok) {
    throw new Error('Impossible de charger les logements')
  }

  const body = await readJson(response)
  if (!isPropertyList(body)) {
    throw new Error('Impossible de charger les logements')
  }

  return body
}

export async function getProperty(id: string): Promise<Property | null> {
  const response = await fetch(`${API_BASE}/api/properties/${encodeURIComponent(id)}`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Impossible de charger le logement')
  }

  const body = await readJson(response)
  if (!isProperty(body)) {
    throw new Error('Impossible de charger le logement')
  }

  return body
}
