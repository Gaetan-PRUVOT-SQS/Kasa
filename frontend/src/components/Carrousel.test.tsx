import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Carrousel from './Carrousel'

describe('Carrousel', () => {
  it('renders nothing when there is no picture', () => {
    const { container } = render(<Carrousel pictures={[]} title="Vide" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when the current slot is empty', () => {
    const pictures: string[] = []
    pictures.length = 1
    const { container } = render(<Carrousel pictures={pictures} title="Trou" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows a single picture without controls', () => {
    render(<Carrousel pictures={['/only.jpg']} title="Studio" />)
    expect(screen.getByRole('img', { name: 'Studio, photo 1 sur 1' })).toHaveAttribute(
      'src',
      '/only.jpg',
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByText('1/1')).not.toBeInTheDocument()
  })

  it('moves forward, backward, and wraps around the gallery', async () => {
    const user = userEvent.setup()
    render(<Carrousel pictures={['/a.jpg', '/b.jpg', '/c.jpg']} title="Cosy" />)

    expect(screen.getByRole('img', { name: 'Cosy, photo 1 sur 3' })).toHaveAttribute(
      'src',
      '/a.jpg',
    )
    expect(screen.getByText('1/3')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Photo suivante' }))
    expect(screen.getByRole('img', { name: 'Cosy, photo 2 sur 3' })).toHaveAttribute(
      'src',
      '/b.jpg',
    )

    await user.click(screen.getByRole('button', { name: 'Photo suivante' }))
    await user.click(screen.getByRole('button', { name: 'Photo suivante' }))
    expect(screen.getByRole('img', { name: 'Cosy, photo 1 sur 3' })).toHaveAttribute(
      'src',
      '/a.jpg',
    )

    await user.click(screen.getByRole('button', { name: 'Photo précédente' }))
    expect(screen.getByRole('img', { name: 'Cosy, photo 3 sur 3' })).toHaveAttribute(
      'src',
      '/c.jpg',
    )
  })
})
