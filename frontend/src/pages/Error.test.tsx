import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import ErrorPage from './Error'

describe('Error page', () => {
  it('explains that the page is missing and links back home', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/inconnu']}>
        <Routes>
          <Route path="/" element={<h1>Accueil</h1>} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
    expect(screen.getByText("Oups! La page que vous demandez n'existe pas.")).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: "Retourner sur la page d'accueil" }))
    expect(screen.getByRole('heading', { name: 'Accueil' })).toBeInTheDocument()
  })
})
