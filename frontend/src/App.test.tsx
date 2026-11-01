import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getProperties, getProperty } from './api/api'
import { sampleProperty } from './test/property'
import App from './App'

vi.mock('./api/api', () => ({
  getProperties: vi.fn(),
  getProperty: vi.fn(),
}))

describe('App', () => {
  beforeEach(() => {
    vi.mocked(getProperties).mockReset()
    vi.mocked(getProperty).mockReset()
    vi.mocked(getProperties).mockResolvedValue([sampleProperty])
    vi.mocked(getProperty).mockResolvedValue(sampleProperty)
  })

  it('renders the home page inside the shared layout', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    expect(await screen.findByRole('heading', { name: 'Appartement cosy' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Accueil Kasa' })).toBeInTheDocument()
    expect(screen.getByText('© 2020 Kasa. All rights reserved')).toBeInTheDocument()
  })

  it('renders the about page', async () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>,
    )
    expect(await screen.findByRole('button', { name: 'Fiabilité' })).toBeInTheDocument()
  })

  it('renders a housing page', async () => {
    render(
      <MemoryRouter initialEntries={['/logement/c67ab8a7']}>
        <App />
      </MemoryRouter>,
    )
    expect(await screen.findByRole('heading', { name: 'Appartement cosy' })).toBeInTheDocument()
    expect(screen.getByText('Ile de France - Paris 17e')).toBeInTheDocument()
  })

  it('renders the 404 page for an unknown url', async () => {
    render(
      <MemoryRouter initialEntries={['/inconnu']}>
        <App />
      </MemoryRouter>,
    )
    expect(await screen.findByRole('heading', { name: '404' })).toBeInTheDocument()
  })
})
