import { useState } from 'react'
import OnboardingStep from './OnboardingStep'

const EXAM_TIMING = [
  { value: 'hoje', label: 'Hoje' },
  { value: 'amanha', label: 'Amanhã' },
  { value: '2-3-dias', label: '2–3 dias' },
  { value: 'esta-semana', label: 'Esta semana' },
  { value: 'mais-pra-frente', label: 'Mais pra frente' },
  { value: 'nao-marquei', label: 'Ainda não marquei' },
]

const STATES = [
  { value: 'SP', label: 'São Paulo' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'BA', label: 'Bahia' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'outro', label: 'Outro estado' },
]

const STUDY_LEVEL = [
  { value: 'quase-nada', label: 'Quase nada' },
  { value: 'um-pouco', label: 'Um pouco' },
  { value: 'ja-simulados', label: 'Já faço simulados' },
  { value: 'revisando', label: 'Estou revisando' },
]

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState({ examTiming: null, estado: null, studyLevel: null })

  if (step === 1) {
    return (
      <OnboardingStep
        step={1}
        total={3}
        title="Quando é sua prova?"
        options={EXAM_TIMING}
        selected={profile.examTiming}
        onSelect={(v) => setProfile((p) => ({ ...p, examTiming: v }))}
        onNext={() => setStep(2)}
        ctaLabel="PRÓXIMO"
        label="Onboarding · 1 de 3"
      />
    )
  }

  if (step === 2) {
    return (
      <OnboardingStep
        step={2}
        total={3}
        title="Qual seu estado?"
        options={STATES}
        selected={profile.estado}
        onSelect={(v) => setProfile((p) => ({ ...p, estado: v }))}
        onNext={() => setStep(3)}
        ctaLabel="PRÓXIMO"
        label="Onboarding · 2 de 3"
      />
    )
  }

  return (
    <OnboardingStep
      step={3}
      total={3}
      title="Quanto você já estudou?"
      options={STUDY_LEVEL}
      selected={profile.studyLevel}
      onSelect={(v) => setProfile((p) => ({ ...p, studyLevel: v }))}
      onNext={() => onComplete(profile)}
      ctaLabel="DESCOBRIR MEU NÍVEL"
      label="Onboarding · 3 de 3"
    />
  )
}
