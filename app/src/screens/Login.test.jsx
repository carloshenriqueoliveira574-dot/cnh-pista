import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Login from './Login'

const signInWithOtp = vi.fn()
const verifyOtp = vi.fn()

vi.mock('../lib/supabaseClient', () => ({
  get supabase() {
    return {
      auth: {
        signInWithOtp: (...args) => signInWithOtp(...args),
        verifyOtp: (...args) => verifyOtp(...args),
        signInWithOAuth: vi.fn(),
      },
    }
  },
}))

async function goToEmailForm(user) {
  render(<Login onComplete={vi.fn()} />)
  await user.click(screen.getByText('Continuar com e-mail'))
}

describe('Login anti-abuse', () => {
  beforeEach(() => {
    signInWithOtp.mockReset()
    verifyOtp.mockReset()
  })

  it('does not call Supabase when the honeypot field is filled', async () => {
    const user = userEvent.setup()
    await goToEmailForm(user)

    const honeypot = document.querySelector('input[name="website"]')
    await user.type(honeypot, 'http://spam.example')
    await user.type(screen.getByPlaceholderText('seu@email.com'), 'real@example.com')
    await user.click(screen.getByText('Enviar código'))

    expect(signInWithOtp).not.toHaveBeenCalled()
    expect(screen.getByText(/Enviamos um e-mail/)).toBeInTheDocument()
  })

  it('disables resending during the cooldown after a real send', async () => {
    signInWithOtp.mockResolvedValue({ error: null })
    const user = userEvent.setup()
    await goToEmailForm(user)

    await user.type(screen.getByPlaceholderText('seu@email.com'), 'real@example.com')
    await user.click(screen.getByText('Enviar código'))

    expect(signInWithOtp).toHaveBeenCalledTimes(1)
    await user.click(screen.getByText('Usar outro e-mail'))
    expect(screen.getByRole('button', { name: /Aguarde \d+s/ })).toBeDisabled()
  })

  it('surfaces a clear message on a Supabase rate-limit error', async () => {
    signInWithOtp.mockResolvedValue({ error: { status: 429, message: 'rate limited' } })
    const user = userEvent.setup()
    await goToEmailForm(user)

    await user.type(screen.getByPlaceholderText('seu@email.com'), 'real@example.com')
    await user.click(screen.getByText('Enviar código'))

    expect(screen.getByText(/pediu vários códigos em pouco tempo/)).toBeInTheDocument()
  })

  it('locks out the code field after 5 wrong attempts', async () => {
    verifyOtp.mockResolvedValue({ error: { message: 'invalid' } })
    signInWithOtp.mockResolvedValue({ error: null })
    const user = userEvent.setup()
    await goToEmailForm(user)

    await user.type(screen.getByPlaceholderText('seu@email.com'), 'real@example.com')
    await user.click(screen.getByText('Enviar código'))
    await user.click(screen.getByText('Recebi um código em vez de um link'))

    for (let i = 0; i < 4; i += 1) {
      const codeInput = screen.getByPlaceholderText('000000')
      await user.clear(codeInput)
      await user.type(codeInput, '000000')
      await user.click(screen.getByText('Entrar com o código'))
      expect(screen.getByText('Código inválido ou expirado. Confira e tente de novo.')).toBeInTheDocument()
    }

    const lastCodeInput = screen.getByPlaceholderText('000000')
    await user.clear(lastCodeInput)
    await user.type(lastCodeInput, '000000')
    await user.click(screen.getByText('Entrar com o código'))

    expect(screen.getByText('Muitas tentativas com esse código. Peça um código novo.')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('000000')).not.toBeInTheDocument()
  })
})
