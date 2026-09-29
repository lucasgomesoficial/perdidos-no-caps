import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EventsSection } from './events-section'

const event = {
  title: 'Festa de Halloween',
  description: 'Venha com a sua fantasia.',
  image: {
    url: 'https://images.ctfassets.net/nofz0vh5p7s4/asset/halloween.png?w=1200&fm=webp',
    width: 1080,
    height: 1350,
    alt: 'Banner da festa de Halloween',
  },
}

describe('seção de eventos', () => {
  it('preserva as dimensões da imagem e remove o skeleton quando ela carrega', () => {
    render(<EventsSection events={[event]} />)

    const image = screen.getByRole('img', { name: event.image.alt })
    expect(image).toHaveAttribute('width', '1080')
    expect(image).toHaveAttribute('height', '1350')
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(
      screen.getByRole('status', { name: /carregando imagem/i }),
    ).toBeInTheDocument()

    fireEvent.load(image)

    expect(
      screen.queryByRole('status', { name: /carregando imagem/i }),
    ).not.toBeInTheDocument()
    expect(screen.getByText(event.title)).toBeInTheDocument()
    expect(screen.getByText(event.description)).toBeInTheDocument()
  })

  it('mantém o conteúdo do evento quando a imagem falha', () => {
    render(<EventsSection events={[event]} />)
    fireEvent.error(screen.getByRole('img', { name: event.image.alt }))

    expect(
      screen.queryByRole('img', { name: event.image.alt }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('status', { name: /carregando imagem/i }),
    ).not.toBeInTheDocument()
    expect(screen.getByText(event.title)).toBeInTheDocument()
  })
})
