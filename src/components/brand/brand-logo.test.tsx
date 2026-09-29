import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { BrandLogo } from './brand-logo'

it('renderiza a marca com dimensões estáveis e prioridade configurável', () => {
  const { rerender } = render(<BrandLogo eager />)
  const logo = screen.getByRole('img', { name: 'Perdidos no CAPS' })

  expect(logo).toHaveAttribute('width', '1254')
  expect(logo).toHaveAttribute('height', '1254')
  expect(logo).toHaveAttribute('loading', 'eager')

  rerender(<BrandLogo compact />)
  expect(screen.getByRole('img', { name: 'Perdidos no CAPS' })).toHaveAttribute(
    'loading',
    'lazy',
  )
})
