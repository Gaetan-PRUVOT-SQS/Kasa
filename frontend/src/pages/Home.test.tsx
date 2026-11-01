import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getProperties } from '../api/api'
import { sampleProperty } from '../test/property'
import Home from './Home'

vi.mock('../api/api', () => ({
  getProperties: vi.fn(),
}))

describe('Home', () => {
  beforeEach(() => {
    vi.mocked(getProperties).mockReset()
  })

  it('shows a loading message while the catalogue is loading', () => {
    vi.mocked(getProperties).mockReturnValue(new Promise(() => undefined))
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    expect(screen.getByText('Chargement…')).toBeInTheDocument()
  })

  it('renders a card for each property', async () => {
    vi.mocked(getProperties).mockResolvedValue([sampleProperty])
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('heading', { name: 'Chez vous, partout et ailleurs' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Appartement cosy' })).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/logement/c67ab8a7')
  })

  it('shows the error message when loading fails', async () => {
    vi.mocked(getProperties).mockRejectedValue(new Error('Impossible de charger les logements'))
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    expect(await screen.findByText('Impossible de charger les logements')).toBeInTheDocument()
  })

  it('shows a fallback message when the failure is not an Error', async () => {
    vi.mocked(getProperties).mockRejectedValue('panne')
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    expect(await screen.findByText('Impossible de charger les logements')).toBeInTheDocument()
  })
})
