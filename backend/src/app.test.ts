import request from 'supertest'
import { describe, expect, it } from 'vitest'
import app, { readId } from './app.js'
import { loadProperties } from './properties.js'

function payload(response: { body: unknown }): unknown {
  return response.body
}

describe('readId', () => {
  it('reads a single id', () => {
    expect(readId('c67ab8a7')).toBe('c67ab8a7')
  })

  it('reads the first id when Express repeats the parameter', () => {
    expect(readId(['c67ab8a7', 'b9123946'])).toBe('c67ab8a7')
  })

  it('returns an empty string when the parameter is missing', () => {
    expect(readId(undefined)).toBe('')
    expect(readId([])).toBe('')
  })
})

describe('GET /api/properties', () => {
  it('returns the full catalogue as JSON', async () => {
    const catalogue = loadProperties()
    const response = await request(app).get('/api/properties')

    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toMatch(/application\/json/)
    expect(payload(response)).toEqual(catalogue)
  })

  it('keeps the previous behaviour of answering other methods with the catalogue', async () => {
    const response = await request(app).post('/api/properties').send({})
    expect(response.status).toBe(200)
    expect(Array.isArray(payload(response))).toBe(true)
  })
})

describe('GET /api/properties/:id', () => {
  it('returns one property', async () => {
    const response = await request(app).get('/api/properties/c67ab8a7')
    const body = payload(response)

    expect(response.status).toBe(200)
    expect(body).toMatchObject({
      id: 'c67ab8a7',
      title: 'Appartement cosy',
      location: 'Ile de France - Paris 17e',
    })
  })

  it('returns 404 with the historical message when the id is well formed but unknown', async () => {
    const response = await request(app).get('/api/properties/aaaaaaaa')
    expect(response.status).toBe(404)
    expect(payload(response)).toBe('Not found')
  })

  it('returns 400 when the id is not a catalogue id', async () => {
    const response = await request(app).get('/api/properties/not-an-id')
    expect(response.status).toBe(400)
    expect(payload(response)).toEqual({ error: 'Invalid property id' })
  })

  it('does not echo a path-like id', async () => {
    const response = await request(app).get('/api/properties/..%2F..%2Fetc')
    expect(response.status).toBe(400)
    expect(JSON.stringify(payload(response))).not.toContain('etc')
  })
})

describe('security headers', () => {
  it('sends helmet headers, hides the Express signature, and allows the browser to read the API', async () => {
    const response = await request(app).get('/api/properties')

    expect(response.headers['x-powered-by']).toBeUndefined()
    expect(response.headers['x-content-type-options']).toBe('nosniff')
    expect(response.headers['content-security-policy']).toBeTruthy()
    expect(response.headers['cross-origin-resource-policy']).toBe('cross-origin')
    expect(response.headers['access-control-allow-origin']).toBe('*')
    expect(response.headers['access-control-allow-methods']).toContain('GET')
    expect(response.headers['access-control-allow-headers']).toContain('Content-Type')
  })

  it('applies the same CORS headers on OPTIONS', async () => {
    const response = await request(app).options('/api/properties')
    expect(response.status).toBe(200)
    expect(response.headers['access-control-allow-origin']).toBe('*')
    expect(response.headers['access-control-allow-methods']).toContain('OPTIONS')
  })
})

describe('unknown routes', () => {
  it('still answers 404 outside the catalogue routes', async () => {
    const response = await request(app).get('/api/unknown')
    expect(response.status).toBe(404)
  })
})
