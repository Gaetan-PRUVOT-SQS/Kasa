import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Banner from './Banner'

describe('Banner', () => {
  it('affiche le titre quand la prop title est fournie', () => {
    render(<Banner title="Chez vous, partout et ailleurs" />)
    expect(
      screen.getByRole('heading', { name: 'Chez vous, partout et ailleurs' })
    ).toBeInTheDocument()
  })

  it('n’affiche aucun titre quand la prop title est absente', () => {
    render(<Banner image="/banner-about.jpg" />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('applique l’image de fond passée en prop', () => {
    const { container } = render(<Banner image="/banner-home.jpg" title="X" />)
    expect(container.firstChild).toHaveStyle({
      backgroundImage: 'url(/banner-home.jpg)',
    })
  })
})
