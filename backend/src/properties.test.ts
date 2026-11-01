import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  findProperty,
  isPropertyId,
  loadProperties,
  parseProperties,
  type Property,
} from './properties.js'

function property(overrides: Partial<Property> = {}): Property {
  return {
    id: 'c67ab8a7',
    title: 'Appartement cosy',
    cover: 'https://example.test/cover.jpg',
    pictures: ['https://example.test/1.jpg'],
    description: 'Un appartement calme.',
    host: { name: 'Nathalie Jean', picture: 'https://example.test/host.jpg' },
    rating: '5',
    location: 'Ile de France - Paris 17e',
    equipments: ['WIFI'],
    tags: ['Batignolle'],
    ...overrides,
  }
}

describe('property ids', () => {
  it('accepts the 8 character ids stored in the catalogue', () => {
    expect(isPropertyId('c67ab8a7')).toBe(true)
  })

  it('rejects ids that are not lowercase hex of length 8', () => {
    expect(isPropertyId('C67AB8A7')).toBe(false)
    expect(isPropertyId('c67ab8a')).toBe(false)
    expect(isPropertyId('c67ab8a70')).toBe(false)
    expect(isPropertyId('../etc/passwd')).toBe(false)
    expect(isPropertyId('')).toBe(false)
  })
})

describe('parseProperties', () => {
  it('returns the catalogue entries', () => {
    const parsed = parseProperties([property()])
    expect(parsed).toEqual([property()])
  })

  it('rejects a payload that is not an array', () => {
    expect(() => parseProperties({ id: 'c67ab8a7' })).toThrow(
      'Property data must be an array',
    )
  })

  it('rejects an entry that is not an object', () => {
    expect(() => parseProperties(['nope'])).toThrow('Invalid property at index 0')
  })

  it('rejects an entry whose id is not a catalogue id', () => {
    expect(() => parseProperties([property({ id: 'not-an-id' })])).toThrow(
      'Invalid property at index 0',
    )
  })

  it('rejects an entry whose pictures are not strings', () => {
    const broken = { ...property(), pictures: ['ok', 2] }
    expect(() => parseProperties([broken])).toThrow('Invalid property at index 0')
  })

  it('rejects a host that is missing or incomplete', () => {
    expect(() => parseProperties([{ ...property(), host: null }])).toThrow(
      'Invalid property at index 0',
    )
    expect(() => parseProperties([{ ...property(), host: ['Nathalie'] }])).toThrow(
      'Invalid property at index 0',
    )
    expect(() =>
      parseProperties([{ ...property(), host: { name: 'Nathalie' } }]),
    ).toThrow('Invalid property at index 0')
    expect(() =>
      parseProperties([{ ...property(), host: { picture: 'https://example.test/h.jpg' } }]),
    ).toThrow('Invalid property at index 0')
  })
})

describe('loadProperties', () => {
  it('loads the committed catalogue', () => {
    const properties = loadProperties()
    expect(properties).toHaveLength(20)
    expect(properties[0]?.id).toBe('c67ab8a7')
    expect(properties[0]?.title).toBe('Appartement cosy')
  })

  it('reads an explicit file url', () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'kasa-data-'))
    const file = path.join(dir, 'data.json')
    writeFileSync(file, JSON.stringify([property({ id: 'aaaaaaaa', title: 'Studio' })]))
    const loaded = loadProperties(pathToFileURL(file))
    expect(loaded).toEqual([property({ id: 'aaaaaaaa', title: 'Studio' })])
  })

  it('fails when the file is not a property array', () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'kasa-data-'))
    const file = path.join(dir, 'data.json')
    writeFileSync(file, JSON.stringify({ hello: true }))
    expect(() => loadProperties(pathToFileURL(file))).toThrow(
      'Property data must be an array',
    )
  })
})

describe('findProperty', () => {
  const catalogue = [property(), property({ id: 'b9123946', title: 'Canal' })]

  it('returns the matching property', () => {
    expect(findProperty(catalogue, 'b9123946')?.title).toBe('Canal')
  })

  it('returns undefined when the id is absent', () => {
    expect(findProperty(catalogue, 'aaaaaaaa')).toBeUndefined()
  })
})
