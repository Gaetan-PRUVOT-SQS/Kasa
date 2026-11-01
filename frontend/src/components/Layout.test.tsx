import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Layout from './Layout'

describe('Layout', () => {
  it('renders the header, the page, and the footer', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<p>Contenu principal</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Accueil Kasa' })).toBeInTheDocument()
    expect(screen.getByText('Contenu principal')).toBeInTheDocument()
    expect(screen.getByText('© 2020 Kasa. All rights reserved')).toBeInTheDocument()
  })
})
