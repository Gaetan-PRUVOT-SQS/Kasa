import { describe, expect, it, vi } from 'vitest'

const { startServer } = vi.hoisted(() => ({
  startServer: vi.fn(),
}))

vi.mock('./server.js', () => ({
  startServer,
}))

describe('main', () => {
  it('starts the server when the process is launched', async () => {
    startServer.mockClear()
    vi.resetModules()
    await import('./main.js')
    expect(startServer).toHaveBeenCalledTimes(1)
  })
})
