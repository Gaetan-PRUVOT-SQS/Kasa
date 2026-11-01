import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  getProperties,
  getProperty,
  isProperty,
  resolveApiBase,
  type Property,
} from './api'

const property: Property = {
  id: 'c67ab8a7',
  title: 'Appartement cosy',
  cover: '/cover.jpg',
  pictures: ['/a.jpg', '/b.jpg'],
  description: 'Un appartement calme.',
  host: { name: 'Nathalie Jean', picture: '/host.jpg' },
  rating: '5',
  location: 'Ile de France - Paris 17e',
  equipments: ['WIFI'],
  tags: ['Batignolle'],
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('resolveApiBase', () => {
  it('uses an explicit API url, including an empty one', () => {
    expect(resolveApiBase({ VITE_API_URL: 'https://api.example.test', DEV: true })).toBe(
      'https://api.example.test',
    )
    expect(resolveApiBase({ VITE_API_URL: '', DEV: false })).toBe('')
  })

  it('uses the dev proxy when no url is configured', () => {
    expect(resolveApiBase({ DEV: true })).toBe('')
  })

  it('falls back to the local API outside dev', () => {
    expect(resolveApiBase({ DEV: false })).toBe('http://localhost:8080')
  })
})

describe('isProperty', () => {
  it('accepts a catalogue property', () => {
    expect(isProperty(property)).toBe(true)
  })

  it('rejects malformed records', () => {
    expect(isProperty(null)).toBe(false)
    expect(isProperty([])).toBe(false)
    expect(isProperty({ ...property, host: null })).toBe(false)
    expect(isProperty({ ...property, pictures: [1] })).toBe(false)
    expect(isProperty({ ...property, tags: 'Batignolle' })).toBe(false)
  })
})

describe('getProperties', () => {
  it('returns the properties from a successful response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse([property])),
    )

    await expect(getProperties()).resolves.toEqual([property])
    expect(fetch).toHaveBeenCalledWith('/api/properties')
  })

  it('throws when the response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ error: 'nope' }, 500)))

    await expect(getProperties()).rejects.toThrow('Impossible de charger les logements')
  })

  it('throws when the payload is not a property list', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse([{ id: 'x' }])))

    await expect(getProperties()).rejects.toThrow('Impossible de charger les logements')
  })

  it('throws when the payload is not an array', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ items: [] })))

    await expect(getProperties()).rejects.toThrow('Impossible de charger les logements')
  })
})

describe('getProperty', () => {
  it('returns the property', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(property)))

    await expect(getProperty('c67ab8a7')).resolves.toEqual(property)
    expect(fetch).toHaveBeenCalledWith('/api/properties/c67ab8a7')
  })

  it('returns null on 404', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('missing', { status: 404 })))

    await expect(getProperty('aaaaaaaa')).resolves.toBeNull()
  })

  it('throws when the response fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({}, 500)))

    await expect(getProperty('c67ab8a7')).rejects.toThrow('Impossible de charger le logement')
  })

  it('throws when the payload is not a property', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ id: 'c67ab8a7' })))

    await expect(getProperty('c67ab8a7')).rejects.toThrow('Impossible de charger le logement')
  })

  it('encodes the id', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 404 })))

    await getProperty('a b')
    expect(fetch).toHaveBeenCalledWith('/api/properties/a%20b')
  })
})
