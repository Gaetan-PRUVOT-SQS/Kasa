import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Logo from './Logo'

describe('Logo', () => {
  it('uses the red logo by default', () => {
    render(<Logo />)
    expect(screen.getByRole('img', { name: 'Kasa' })).toHaveAttribute('src', '/logo.svg')
  })

  it('uses the white logo when asked', () => {
    render(<Logo variant="white" />)
    expect(screen.getByRole('img', { name: 'Kasa' })).toHaveAttribute('src', '/logo-white.svg')
  })
})
