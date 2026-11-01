import express, { type Request, type Response } from 'express'
import helmet from 'helmet'
import { findProperty, isPropertyId, loadProperties } from './properties.js'

const properties = loadProperties()

export function readId(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value)) {
    const first: unknown = value[0]
    return typeof first === 'string' ? first : ''
  }
  return ''
}

const app = express()

app.disable('x-powered-by')

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
)

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  )
  next()
})

app.use('/api/properties/:id', (req: Request, res: Response) => {
  const id = readId(req.params.id)
  if (!isPropertyId(id)) {
    res.status(400).json({ error: 'Invalid property id' })
    return
  }

  const property = findProperty(properties, id)
  if (property === undefined) {
    res.status(404).json('Not found')
    return
  }

  res.status(200).json(property)
})

app.use('/api/properties', (_req: Request, res: Response) => {
  res.status(200).json(properties)
})

export default app
