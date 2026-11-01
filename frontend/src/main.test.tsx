import { describe, expect, it, vi } from 'vitest'

const renderRoot = vi.hoisted(() => vi.fn())
const createRoot = vi.hoisted(() => vi.fn(() => ({ render: renderRoot })))

vi.mock('react-dom/client', () => ({
  createRoot,
}))

describe('main', () => {
  it('mounts the app on #root', async () => {
    document.body.innerHTML = '<div id="root"></div>'
    renderRoot.mockClear()
    createRoot.mockClear()
    vi.resetModules()

    await import('./main')

    const root = document.getElementById('root')
    expect(createRoot).toHaveBeenCalledTimes(1)
    expect(createRoot).toHaveBeenCalledWith(root)
    expect(renderRoot).toHaveBeenCalledTimes(1)
  })

  it('throws when #root is missing', async () => {
    document.body.innerHTML = ''
    vi.resetModules()
    await expect(import('./main')).rejects.toThrow('Element #root introuvable')
  })
})
