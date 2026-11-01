import { mkdtempSync, rmSync } from 'node:fs'
import http from 'node:http'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createErrorHandler,
  formatListenErrorBind,
  formatListeningBind,
  normalizePort,
  resolvePort,
  startServer,
} from './server.js'

const servers: http.Server[] = []

afterEach(async () => {
  await Promise.all(
    servers.splice(0).map(
      (server) =>
        new Promise<void>((resolve, reject) => {
          if (!server.listening) {
            resolve()
            return
          }
          server.close((error) => {
            if (error) {
              reject(error)
              return
            }
            resolve()
          })
        }),
    ),
  )
})

function listenError(code: string, syscall = 'listen'): NodeJS.ErrnoException {
  return Object.assign(new Error(code), { code, syscall })
}

describe('normalizePort', () => {
  it('returns a number for a numeric port', () => {
    expect(normalizePort('8080')).toBe(8080)
    expect(normalizePort('0')).toBe(0)
  })

  it('returns the original value when it is not numeric', () => {
    expect(normalizePort('/tmp/kasa.sock')).toBe('/tmp/kasa.sock')
  })

  it('returns false for a negative port', () => {
    expect(normalizePort('-1')).toBe(false)
  })
})

describe('resolvePort', () => {
  it('prefers an explicit port', () => {
    expect(resolvePort('3000', '8080')).toBe('3000')
  })

  it('keeps an explicit empty string', () => {
    expect(resolvePort('', '8080')).toBe('')
  })

  it('uses the environment port when no port is passed', () => {
    expect(resolvePort(undefined, '9090')).toBe('9090')
  })

  it('falls back to 8080', () => {
    expect(resolvePort(undefined, undefined)).toBe('8080')
    expect(resolvePort(undefined, '')).toBe('8080')
  })
})

describe('bind descriptions', () => {
  it('describes pipes and numeric ports the way the server logs them', () => {
    expect(formatListenErrorBind('/tmp/kasa.sock', 8080)).toBe('pipe /tmp/kasa.sock')
    expect(formatListenErrorBind(null, 8080)).toBe('port: 8080')
    expect(formatListeningBind('/tmp/kasa.sock', 8080)).toBe('pipe /tmp/kasa.sock')
    expect(formatListeningBind(null, false)).toBe('port false')
  })
})

describe('createErrorHandler', () => {
  it('rethrows errors that are not listen failures', () => {
    const handler = createErrorHandler({ address: () => null }, 8080)
    const error = new Error('boom')
    expect(() => handler(error)).toThrow('boom')
  })

  it('reports EACCES for a port and stops the process', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('exit:1')
    })
    const handler = createErrorHandler({ address: () => null }, 8080)

    expect(() => handler(listenError('EACCES'))).toThrow('exit:1')
    expect(errorSpy).toHaveBeenCalledWith('port: 8080 requires elevated privileges.')

    errorSpy.mockRestore()
    exitSpy.mockRestore()
  })

  it('reports EACCES for a named pipe', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('exit:1')
    })
    const handler = createErrorHandler({ address: () => '/tmp/kasa.sock' }, '/tmp/kasa.sock')

    expect(() => handler(listenError('EACCES'))).toThrow('exit:1')
    expect(errorSpy).toHaveBeenCalledWith(
      'pipe /tmp/kasa.sock requires elevated privileges.',
    )

    errorSpy.mockRestore()
    exitSpy.mockRestore()
  })

  it('reports EADDRINUSE and stops the process', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('exit:1')
    })
    const handler = createErrorHandler({ address: () => null }, 8080)

    expect(() => handler(listenError('EADDRINUSE'))).toThrow('exit:1')
    expect(errorSpy).toHaveBeenCalledWith('port: 8080 is already in use.')

    errorSpy.mockRestore()
    exitSpy.mockRestore()
  })

  it('rethrows an unknown listen error', () => {
    const handler = createErrorHandler({ address: () => null }, 8080)
    expect(() => handler(listenError('EPERM'))).toThrow('EPERM')
  })
})

describe('startServer', () => {
  it('listens on the requested port and logs it', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const server = startServer('0')
    servers.push(server)

    await vi.waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith('Listening on port 0')
    })
    expect(server.listening).toBe(true)
    logSpy.mockRestore()
  })

  it('listens on a named pipe', async () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'kasa-pipe-'))
    const pipe = path.join(dir, 'kasa.sock')
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const server = startServer(pipe)
    servers.push(server)

    await new Promise<void>((resolve, reject) => {
      server.once('listening', () => resolve())
      server.once('error', reject)
    })

    expect(logSpy).toHaveBeenCalledWith(`Listening on pipe ${pipe}`)
    logSpy.mockRestore()
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error)
          return
        }
        resolve()
      })
    })
    rmSync(dir, { recursive: true, force: true })
  })

  it('refuses a negative port', () => {
    expect(() => startServer('-1')).toThrow('Invalid port')
  })
})
