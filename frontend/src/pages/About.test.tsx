import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import About from './About'

describe('About', () => {
  it('lists the four Kasa values and reveals one on click', async () => {
    const user = userEvent.setup()
    render(<About />)

    expect(screen.getByRole('heading', { name: 'À propos' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fiabilité' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(screen.getByRole('button', { name: 'Respect' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Service' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sécurité' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Fiabilité' }))
    expect(screen.getByRole('button', { name: 'Fiabilité' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByText(/fiabilité totale/)).toBeInTheDocument()
  })
})
