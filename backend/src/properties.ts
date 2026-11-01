import { readFileSync } from 'node:fs'

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

const PROPERTY_ID = /^[a-f0-9]{8}$/

export function isPropertyId(value: string): boolean {
  return PROPERTY_ID.test(value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function parseJson(text: string): unknown {
  return JSON.parse(text) as unknown
}

function parseHost(value: unknown): Host | null {
  if (!isRecord(value)) {
    return null
  }
  if (typeof value.name !== 'string' || typeof value.picture !== 'string') {
    return null
  }
  return { name: value.name, picture: value.picture }
}

function parseProperty(value: unknown): Property | null {
  if (!isRecord(value)) {
    return null
  }

  const host = parseHost(value.host)
  if (
    typeof value.id !== 'string' ||
    !isPropertyId(value.id) ||
    typeof value.title !== 'string' ||
    typeof value.cover !== 'string' ||
    !isStringArray(value.pictures) ||
    typeof value.description !== 'string' ||
    host === null ||
    typeof value.rating !== 'string' ||
    typeof value.location !== 'string' ||
    !isStringArray(value.equipments) ||
    !isStringArray(value.tags)
  ) {
    return null
  }

  return {
    id: value.id,
    title: value.title,
    cover: value.cover,
    pictures: value.pictures,
    description: value.description,
    host,
    rating: value.rating,
    location: value.location,
    equipments: value.equipments,
    tags: value.tags,
  }
}

export function parseProperties(value: unknown): Property[] {
  if (!Array.isArray(value)) {
    throw new Error('Property data must be an array')
  }

  return value.map((item, index) => {
    const property = parseProperty(item)
    if (property === null) {
      throw new Error(`Invalid property at index ${String(index)}`)
    }
    return property
  })
}

export function loadProperties(dataUrl?: URL): Property[] {
  const url = dataUrl ?? defaultDataUrl()
  const text = readFileSync(url, 'utf8')
  return parseProperties(parseJson(text))
}

export function defaultDataUrl(): URL {
  return new URL('../data.json', import.meta.url)
}

export function findProperty(
  properties: readonly Property[],
  id: string,
): Property | undefined {
  return properties.find((property) => property.id === id)
}
