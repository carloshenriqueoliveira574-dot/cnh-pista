import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Admin from './Admin'

const adminListQuestions = vi.fn()
const adminSaveQuestion = vi.fn()
const adminDeleteQuestion = vi.fn()

vi.mock('../lib/backend', () => ({
  adminListQuestions: (...args) => adminListQuestions(...args),
  adminSaveQuestion: (...args) => adminSaveQuestion(...args),
  adminDeleteQuestion: (...args) => adminDeleteQuestion(...args),
}))

const SAMPLE_QUESTION = {
  id: 'cruzamento-direita',
  category: 'Preferência',
  prompt: 'Quem tem preferência num cruzamento sem sinalização?',
  scene: 'intersection',
  sceneVariant: undefined,
  options: ['Quem vem pela direita', 'Quem chega primeiro', 'Quem está mais rápido', 'Quem buzina primeiro'],
  correctIndex: 0,
  lead: 'A regra vale para cruzamentos sem sinalização.',
  explanation: 'Na ausência de sinalização, tem preferência quem vem pela direita.',
  trap: 'Muita gente acha que é quem chega primeiro.',
  wrongNotes: {},
  macete: { quote: 'Direita sempre primeiro', hint: 'Pense no relógio' },
}

describe('Admin', () => {
  beforeEach(() => {
    adminListQuestions.mockReset()
    adminSaveQuestion.mockReset()
    adminDeleteQuestion.mockReset()
  })

  it('loads and lists questions', async () => {
    adminListQuestions.mockResolvedValue([SAMPLE_QUESTION])
    render(<Admin onBack={vi.fn()} />)

    await waitFor(() => expect(screen.getByText(SAMPLE_QUESTION.prompt)).toBeInTheDocument())
    expect(screen.getByText('1 questões')).toBeInTheDocument()
  })

  it('shows a clear error if loading fails', async () => {
    adminListQuestions.mockRejectedValue(new Error('falha de rede'))
    render(<Admin onBack={vi.fn()} />)

    await waitFor(() => expect(screen.getByText('falha de rede')).toBeInTheDocument())
  })

  it('opens the new-question form and requires the core fields', async () => {
    adminListQuestions.mockResolvedValue([])
    const user = userEvent.setup()
    render(<Admin onBack={vi.fn()} />)

    await waitFor(() => expect(screen.getByText('0 questões')).toBeInTheDocument())
    await user.click(screen.getByText('+ Nova questão'))

    expect(screen.getByText('Salvar questão')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Alternativa A')).toBeInTheDocument()
  })

  it('edits an existing question and saves it, with the id locked', async () => {
    adminListQuestions.mockResolvedValue([SAMPLE_QUESTION])
    adminSaveQuestion.mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<Admin onBack={vi.fn()} />)

    await waitFor(() => expect(screen.getByText(SAMPLE_QUESTION.prompt)).toBeInTheDocument())
    await user.click(screen.getByText('Editar'))

    const idInput = screen.getByDisplayValue('cruzamento-direita')
    expect(idInput).toBeDisabled()

    await user.click(screen.getByText('Salvar questão'))
    await waitFor(() => expect(adminSaveQuestion).toHaveBeenCalledTimes(1))
    expect(adminSaveQuestion.mock.calls[0][0].id).toBe('cruzamento-direita')
  })

  it('asks for confirmation before deleting a question', async () => {
    adminListQuestions.mockResolvedValue([SAMPLE_QUESTION])
    adminDeleteQuestion.mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<Admin onBack={vi.fn()} />)

    await waitFor(() => expect(screen.getByText(SAMPLE_QUESTION.prompt)).toBeInTheDocument())
    await user.click(screen.getByText('Excluir'))
    expect(adminDeleteQuestion).not.toHaveBeenCalled()

    await user.click(screen.getByText('Confirmar'))
    await waitFor(() => expect(adminDeleteQuestion).toHaveBeenCalledWith('cruzamento-direita'))
  })
})
