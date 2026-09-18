import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('shows the landing page by default, with no Supabase configured', () => {
    render(<App />)
    expect(screen.getByText('Decorar não passa. Entender, sim.')).toBeInTheDocument()
  })

  it('goes from landing to login on "Começar agora"', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByText('COMEÇAR AGORA — É GRÁTIS'))
    expect(screen.getByText('Pare de decorar respostas.')).toBeInTheDocument()
  })

  it('opens and closes the Privacy Policy from the landing page footer', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByText('Política de Privacidade'))
    expect(screen.getByRole('heading', { name: 'Política de Privacidade' })).toBeInTheDocument()
    await user.click(screen.getByText('voltar'))
    expect(screen.getByText('Decorar não passa. Entender, sim.')).toBeInTheDocument()
  })
})
