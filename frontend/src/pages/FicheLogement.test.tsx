import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getProperty } from '../api/api'
import { sampleProperty } from '../test/property'
import ErrorPage from './Error'
import FicheLogement from './FicheLogement'

vi.mock('../api/api', () => ({
  getProperty: vi.fn(),
}))

function renderFiche(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/logement/:id" element={<FicheLogement />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('FicheLogement', () => {
  beforeEach(() => {
    vi.mocked(getProperty).mockReset()
  })

  it('shows a loading message', () => {
    vi.mocked(getProperty).mockReturnValue(new Promise(() => undefined))
    renderFiche('/logement/c67ab8a7')
    expect(screen.getByText('Chargement…')).toBeInTheDocument()
  })

  it('shows the housing details', async () => {
    const user = userEvent.setup()
    vi.mocked(getProperty).mockResolvedValue(sampleProperty)
    renderFiche('/logement/c67ab8a7')

    expect(await screen.findByRole('heading', { name: 'Appartement cosy' })).toBeInTheDocument()
    expect(screen.getByText('Ile de France - Paris 17e')).toBeInTheDocument()
    expect(screen.getByText('Batignolle')).toBeInTheDocument()
    expect(screen.getByText('Montmartre')).toBeInTheDocument()
    expect(screen.getByText('Nathalie Jean')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Note : 4 sur 5' })).toBeInTheDocument()
    expect(getProperty).toHaveBeenCalledWith('c67ab8a7')

    await user.click(screen.getByRole('button', { name: 'Description' }))
    expect(screen.getByText('Un appartement calme.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Équipements' }))
    expect(screen.getByText('WIFI')).toBeInTheDocument()
    expect(screen.getByText('Frigo')).toBeInTheDocument()
  })

  it('sends the visitor to the 404 page when the property does not exist', async () => {
    vi.mocked(getProperty).mockResolvedValue(null)
    renderFiche('/logement/aaaaaaaa')
    expect(await screen.findByRole('heading', { name: '404' })).toBeInTheDocument()
  })

  it('shows an error when the request fails', async () => {
    vi.mocked(getProperty).mockRejectedValue(new Error('Impossible de charger le logement'))
    renderFiche('/logement/c67ab8a7')
    expect(await screen.findByText('Impossible de charger le logement')).toBeInTheDocument()
  })

  it('shows a fallback message when the failure is not an Error', async () => {
    vi.mocked(getProperty).mockRejectedValue('panne')
    renderFiche('/logement/c67ab8a7')
    expect(await screen.findByText('Impossible de charger le logement')).toBeInTheDocument()
  })

  it('redirects when the route has no id', async () => {
    render(
      <MemoryRouter initialEntries={['/fiche']}>
        <Routes>
          <Route path="/fiche" element={<FicheLogement />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(await screen.findByRole('heading', { name: '404' })).toBeInTheDocument()
    expect(getProperty).not.toHaveBeenCalled()
  })
})
