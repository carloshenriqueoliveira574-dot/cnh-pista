import { useEffect, useState } from 'react'
import { adminListQuestions, adminSaveQuestion, adminDeleteQuestion } from '../lib/backend'
import styles from './Admin.module.css'

const SCENE_OPTIONS = ['generic', 'intersection']
const VARIANT_OPTIONS = ['road', 'pedestrian', 'sign', 'signal', 'weather']

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function emptyQuestion() {
  return {
    id: '',
    category: '',
    prompt: '',
    scene: 'generic',
    sceneVariant: 'road',
    options: ['', '', '', ''],
    correctIndex: 0,
    lead: '',
    explanation: '',
    trap: '',
    wrongNotes: {},
    macete: { quote: '', hint: '' },
  }
}

export default function Admin({ onBack }) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [view, setView] = useState('list') // 'list' | 'form'
  const [editing, setEditing] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const rows = await adminListQuestions()
      setQuestions(rows)
    } catch (err) {
      setError(err.message || 'Não foi possível carregar as questões.')
    } finally {
      setLoading(false)
    }
  }

  function openNew() {
    setEditing(emptyQuestion())
    setIsNew(true)
    setView('form')
  }

  function openEdit(question) {
    setEditing({ ...question, options: [...question.options], macete: { ...question.macete } })
    setIsNew(false)
    setView('form')
  }

  function backToList() {
    setView('list')
    setEditing(null)
  }

  async function handleSave(question) {
    setSaving(true)
    setError('')
    try {
      await adminSaveQuestion(question)
      await load()
      backToList()
    } catch (err) {
      setError(err.message || 'Não foi possível salvar a questão.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    setSaving(true)
    setError('')
    try {
      await adminDeleteQuestion(id)
      setConfirmDeleteId(null)
      await load()
    } catch (err) {
      setError(err.message || 'Não foi possível excluir a questão.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Painel Admin · Questões</h1>
        <button type="button" className={styles.backLink} onClick={onBack}>
          voltar
        </button>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      {view === 'list' && (
        <>
          <div className={styles.toolbar}>
            <span className={styles.count}>{questions.length} questões</span>
            <button type="button" className={styles.primaryBtn} onClick={openNew}>
              + Nova questão
            </button>
          </div>

          {loading && <p className={styles.muted}>Carregando...</p>}

          {!loading && (
            <div className={styles.list}>
              {questions.map((q) => (
                <div key={q.id} className={styles.row}>
                  <div className={styles.rowInfo}>
                    <span className={styles.rowCategory}>{q.category}</span>
                    <span className={styles.rowPrompt}>{q.prompt}</span>
                  </div>
                  <div className={styles.rowActions}>
                    <button type="button" className={styles.rowBtn} onClick={() => openEdit(q)}>
                      Editar
                    </button>
                    {confirmDeleteId === q.id ? (
                      <>
                        <button
                          type="button"
                          className={styles.rowBtnDanger}
                          onClick={() => handleDelete(q.id)}
                          disabled={saving}
                        >
                          Confirmar
                        </button>
                        <button type="button" className={styles.rowBtn} onClick={() => setConfirmDeleteId(null)}>
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button type="button" className={styles.rowBtn} onClick={() => setConfirmDeleteId(q.id)}>
                        Excluir
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {view === 'form' && editing && (
        <QuestionForm
          question={editing}
          isNew={isNew}
          saving={saving}
          onCancel={backToList}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function QuestionForm({ question, isNew, saving, onCancel, onSave }) {
  const [form, setForm] = useState(question)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function updateOption(index, value) {
    setForm((f) => {
      const options = [...f.options]
      options[index] = value
      return { ...f, options }
    })
  }

  function updateWrongNote(index, value) {
    setForm((f) => ({ ...f, wrongNotes: { ...f.wrongNotes, [index]: value } }))
  }

  function handlePromptBlur() {
    if (isNew && !form.id && form.category && form.prompt) {
      update('id', slugify(`${form.category}-${form.prompt}`).split('-').slice(0, 6).join('-'))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave(form)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label}>Identificador (id)</label>
        <input
          className={styles.input}
          value={form.id}
          onChange={(e) => update('id', slugify(e.target.value))}
          disabled={!isNew}
          required
        />
        {!isNew && <p className={styles.hint}>O id não pode ser alterado depois de criado.</p>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Categoria</label>
        <input
          className={styles.input}
          value={form.category}
          onChange={(e) => update('category', e.target.value)}
          onBlur={handlePromptBlur}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Enunciado da questão</label>
        <textarea
          className={styles.textarea}
          value={form.prompt}
          onChange={(e) => update('prompt', e.target.value)}
          onBlur={handlePromptBlur}
          required
        />
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label}>Cenário</label>
          <select className={styles.input} value={form.scene} onChange={(e) => update('scene', e.target.value)}>
            {SCENE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {form.scene === 'generic' && (
          <div className={styles.field}>
            <label className={styles.label}>Ilustração</label>
            <select
              className={styles.input}
              value={form.sceneVariant}
              onChange={(e) => update('sceneVariant', e.target.value)}
            >
              {VARIANT_OPTIONS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Alternativas (marque a correta)</label>
        {form.options.map((opt, i) => (
          <div key={i} className={styles.optionRow}>
            <input
              type="radio"
              name="correctIndex"
              checked={form.correctIndex === i}
              onChange={() => update('correctIndex', i)}
              className={styles.radio}
            />
            <input
              className={styles.input}
              placeholder={`Alternativa ${String.fromCharCode(65 + i)}`}
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              required
            />
          </div>
        ))}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Notas para cada alternativa errada (opcional)</label>
        {form.options.map((opt, i) =>
          i === form.correctIndex ? null : (
            <input
              key={i}
              className={styles.input}
              placeholder={`Por que "${opt || String.fromCharCode(65 + i)}" está errada`}
              value={form.wrongNotes[i] ?? ''}
              onChange={(e) => updateWrongNote(i, e.target.value)}
              style={{ marginBottom: 8 }}
            />
          )
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Frase de erro (completa "Você marcou X. ...")</label>
        <textarea className={styles.textarea} value={form.lead} onChange={(e) => update('lead', e.target.value)} required />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Explicação (a regra correta)</label>
        <textarea
          className={styles.textarea}
          value={form.explanation}
          onChange={(e) => update('explanation', e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Pegadinha comum</label>
        <textarea className={styles.textarea} value={form.trap} onChange={(e) => update('trap', e.target.value)} required />
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label}>Frase do macete</label>
          <input
            className={styles.input}
            value={form.macete.quote}
            onChange={(e) => update('macete', { ...form.macete, quote: e.target.value })}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Dica do macete</label>
          <input
            className={styles.input}
            value={form.macete.hint}
            onChange={(e) => update('macete', { ...form.macete, hint: e.target.value })}
            required
          />
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.primaryBtn} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar questão'}
        </button>
        <button type="button" className={styles.rowBtn} onClick={onCancel} disabled={saving}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
