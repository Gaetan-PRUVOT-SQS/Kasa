import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Footer from './Footer'
import Host from './Host'
import Rating from './Rating'
import Tag from './Tag'

describe('Tag', () => {
  it('shows the label', () => {
    render(<Tag label="Montmartre" />)
    expect(screen.getByText('Montmartre')).toBeInTheDocument()
  })
})

describe('Host', () => {
  it('shows the host name and portrait', () => {
    render(<Host name="Nathalie Jean" picture="/host.jpg" />)
    expect(screen.getByText('Nathalie Jean')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Nathalie Jean' })).toHaveAttribute(
      'src',
      '/host.jpg',
    )
  })
})

describe('Rating', () => {
  it('fills stars up to the score', () => {
    const { container } = render(<Rating rating="3" />)
    expect(screen.getByRole('img', { name: 'Note : 3 sur 5' })).toBeInTheDocument()
    const stars = [...container.querySelectorAll('.kasa-rating-star')]
    expect(stars).toHaveLength(5)
    const first = stars[0]
    const third = stars[2]
    const fourth = stars[3]
    if (first === undefined || third === undefined || fourth === undefined) {
      throw new Error('Etoiles manquantes')
    }
    expect(first).toHaveClass('kasa-rating-filled')
    expect(third).toHaveClass('kasa-rating-filled')
    expect(fourth).not.toHaveClass('kasa-rating-filled')
  })

  it('fills every star for a score of 5', () => {
    const { container } = render(<Rating rating="5" />)
    expect(container.querySelectorAll('.kasa-rating-filled')).toHaveLength(5)
  })

  it('leaves the stars empty when the score is not numeric', () => {
    render(<Rating rating="haute" />)
    expect(screen.getByRole('img', { name: 'Note : NaN sur 5' })).toBeInTheDocument()
  })
})

describe('Footer', () => {
  it('shows the white logo and the copyright', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    )
    expect(screen.getByRole('img', { name: 'Kasa' })).toHaveAttribute('src', '/logo-white.svg')
    expect(screen.getByText('© 2020 Kasa. All rights reserved')).toBeInTheDocument()
  })
})
