import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Card from './Card'

describe('Card', () => {
  it('links to the housing page and shows the cover', () => {
    render(
      <MemoryRouter>
        <Card id="c67ab8a7" title="Appartement cosy" cover="/cover.jpg" />
      </MemoryRouter>,
    )

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/logement/c67ab8a7')
    expect(screen.getByRole('heading', { name: 'Appartement cosy' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Appartement cosy' })).toHaveAttribute(
      'src',
      '/cover.jpg',
    )
  })
})
