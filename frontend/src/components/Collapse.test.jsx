import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Collapse from './Collapse'

function getContentPanel(container) {
  return container.querySelector('.kasa-collapse-content')
}

describe('Collapse', () => {
  it('est fermé par défaut : le panneau n’est pas ouvert', () => {
    const { container } = render(
      <Collapse title="Description">Texte caché</Collapse>
    )
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(getContentPanel(container)).not.toHaveClass('kasa-collapse-open')
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-expanded',
      'false'
    )
  })

  it('affiche le contenu au clic sur l’en-tête', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Collapse title="Description">Texte révélé</Collapse>
    )
    await user.click(screen.getByRole('button'))
    expect(getContentPanel(container)).toHaveClass('kasa-collapse-open')
    expect(screen.getByText('Texte révélé')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('referme le contenu à un second clic', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Collapse title="Description">Texte bascule</Collapse>
    )
    const header = screen.getByRole('button')
    await user.click(header)
    expect(getContentPanel(container)).toHaveClass('kasa-collapse-open')
    await user.click(header)
    expect(getContentPanel(container)).not.toHaveClass('kasa-collapse-open')
    expect(header).toHaveAttribute('aria-expanded', 'false')
  })
})