import http from 'node:http'
import type { AddressInfo } from 'node:net'
import app from './app.js'

export type Port = string | number | false

export function normalizePort(val: string): Port {
  const port = Number.parseInt(val, 10)
  if (Number.isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}

export function resolvePort(explicit: string | undefined, envPort: string | undefined): string {
  if (explicit !== undefined) {
    return explicit
  }
  if (envPort !== undefined && envPort !== '') {
    return envPort
  }
  return '8080'
}

export interface AddressSource {
  address: () => string | AddressInfo | null
}

export function formatListenErrorBind(
  address: string | AddressInfo | null,
  port: Port,
): string {
  if (typeof address === 'string') {
    return `pipe ${address}`
  }
  return `port: ${String(port)}`
}

export function formatListeningBind(
  address: string | AddressInfo | null,
  port: Port,
): string {
  if (typeof address === 'string') {
    return `pipe ${address}`
  }
  return `port ${String(port)}`
}

export function createErrorHandler(source: AddressSource, port: Port) {
  return (error: NodeJS.ErrnoException): void => {
    if (error.syscall !== 'listen') {
      throw error
    }
    const bind = formatListenErrorBind(source.address(), port)
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges.`)
        return process.exit(1)
      case 'EADDRINUSE':
        console.error(`${bind} is already in use.`)
        return process.exit(1)
      default:
        throw error
    }
  }
}

export function startServer(explicitPort?: string): http.Server {
  const port = normalizePort(resolvePort(explicitPort, process.env.PORT))
  app.set('port', port)
  const server = http.createServer(app)
  server.on('error', createErrorHandler(server, port))
  server.on('listening', () => {
    const bind = formatListeningBind(server.address(), port)
    console.log(`Listening on ${bind}`)
  })

  if (typeof port === 'string') {
    server.listen(port)
  } else if (typeof port === 'number') {
    server.listen(port)
  } else {
    throw new Error('Invalid port')
  }

  return server
}
