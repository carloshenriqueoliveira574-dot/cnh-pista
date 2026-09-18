import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Home from './Home'

const noop = vi.fn()

describe('Home', () => {
  it('renders without crashing when strong/weak/lastSimulado are null (returning user, no diagnostic yet)', () => {
    render(
      <Home
        strong={null}
        weak={null}
        lastSimulado={null}
        onContinue={noop}
        onOpenMacetes={noop}
        onNavigate={noop}
      />
    )
    expect(screen.getByText('Faça o diagnóstico pra saber onde focar.')).toBeInTheDocument()
  })

  it('renders the strong/weak stats when present', () => {
    render(
      <Home
        strong={{ label: 'Sinalização', pct: 88 }}
        weak={{ label: 'Infrações', pct: 52 }}
        lastSimulado={null}
        onContinue={noop}
        onOpenMacetes={noop}
        onNavigate={noop}
      />
    )
    expect(screen.getByText('Sinalização')).toBeInTheDocument()
    expect(screen.getByText('Infrações')).toBeInTheDocument()
  })

  it('greets by display name, falling back to the email prefix', () => {
    render(
      <Home
        displayName={null}
        userEmail="carlos@example.com"
        onContinue={noop}
        onOpenMacetes={noop}
        onNavigate={noop}
      />
    )
    expect(screen.getByText('Bom dia, carlos')).toBeInTheDocument()
  })
})
