import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Header from './Header'

function renderHeader(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route
          path="/about"
          element={
            <>
              <Header />
              <h1>Page à propos</h1>
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Header', () => {
  it('marks Accueil as the current page on the home route', () => {
    renderHeader('/')
    expect(screen.getByRole('link', { name: 'Accueil Kasa' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Accueil' })).toHaveClass('active')
    expect(screen.getByRole('link', { name: 'À Propos' })).not.toHaveClass('active')
  })

  it('navigates to the about page', async () => {
    const user = userEvent.setup()
    renderHeader('/')
    await user.click(screen.getByRole('link', { name: 'À Propos' }))
    expect(screen.getByRole('heading', { name: 'Page à propos' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'À Propos' })).toHaveClass('active')
  })
})
