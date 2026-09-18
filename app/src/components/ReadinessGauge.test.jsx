import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ReadinessGauge from './ReadinessGauge'

describe('ReadinessGauge', () => {
  it('shows the percentage and label', () => {
    render(<ReadinessGauge pct={72} label="QUASE LÁ" />)
    expect(screen.getByText('72%')).toBeInTheDocument()
    expect(screen.getByText('QUASE LÁ')).toBeInTheDocument()
  })

  it('clamps out-of-range values instead of rendering something broken', () => {
    render(<ReadinessGauge pct={140} label="PRONTO" />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('clamps negative values to 0', () => {
    render(<ReadinessGauge pct={-10} label="AINDA NÃO" />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })
})
