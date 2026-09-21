import ReadinessGauge from '../components/ReadinessGauge'
import styles from './Landing.module.css'

const VALUE_PROPS = [
  {
    icon: '🧠',
    title: 'Entenda, não decore',
    text: 'Cada questão errada vira uma explicação visual e um macete de memória — não só o gabarito certo.',
  },
  {
    icon: '🚦',
    title: 'Simulados que imitam a prova',
    text: 'Mesmo número de questões, mesmo tempo, mesma pressão. Sem surpresas no dia oficial.',
  },
  {
    icon: '📊',
    title: 'Saiba quando está pronto',
    text: 'O indicador de preparo mostra exatamente o que falta estudar, categoria por categoria.',
  },
]

const STEPS = [
  { n: '1', title: 'Faça o diagnóstico', text: '10 questões pra descobrir onde você está agora.' },
  { n: '2', title: 'Estude o que importa', text: 'Foco automático nos seus pontos fracos, não em tudo de novo.' },
  { n: '3', title: 'Treine pra valer', text: 'Simulados cronometrados, iguais ao dia da prova.' },
]

const FREE_ITEMS = ['Diagnóstico inicial de nível', 'Banco de questões atualizado', 'Primeiros macetes de memória']

const PREMIUM_ITEMS = [
  'Revisão inteligente dos seus erros',
  'Todos os simulados, sem limite',
  'Explicações visuais completas',
  'Macetes de todas as categorias',
  'Histórico completo de estudo',
  'Plano de estudo personalizado',
]

export default function Landing({ onStart, onOpenPrivacidade, onOpenTermos }) {
  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <span className={styles.brand}>CNH · PISTA</span>
        <button type="button" className={styles.navLink} onClick={() => onStart('nav')}>
          Entrar
        </button>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.headline}>Decorar não passa. Entender, sim.</h1>
          <p className={styles.subhead}>
            O CNH Pista ensina o porquê de cada questão da prova teórica do Detran, com simulados reais e
            explicações que ficam na cabeça — não só até o dia da prova.
          </p>
          <button type="button" className={styles.cta} onClick={() => onStart('hero')}>
            COMEÇAR AGORA — É GRÁTIS
          </button>
          <p className={styles.ctaNote}>Sem cartão de crédito pra começar.</p>
        </div>
        <div className={styles.heroVisual}>
          <ReadinessGauge pct={94} label="PRONTO" />
          <p className={styles.heroVisualNote}>
            É assim que você sabe, com número na tela, quando está pronto pra marcar a data da prova.
          </p>
        </div>
      </section>

      <section className={styles.values}>
        {VALUE_PROPS.map((v) => (
          <div key={v.title} className={styles.valueCard}>
            <span className={styles.valueIcon}>{v.icon}</span>
            <h3 className={styles.valueTitle}>{v.title}</h3>
            <p className={styles.valueText}>{v.text}</p>
          </div>
        ))}
      </section>

      <section className={styles.steps}>
        <h2 className={styles.sectionTitle}>Como funciona</h2>
        <div className={styles.stepsList}>
          {STEPS.map((s) => (
            <div key={s.n} className={styles.step}>
              <span className={styles.stepNumber}>{s.n}</span>
              <div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepText}>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.pricing}>
        <h2 className={styles.sectionTitle}>Planos</h2>
        <div className={styles.pricingGrid}>
          <div className={styles.planCard}>
            <div className={styles.planName}>Grátis</div>
            <div className={styles.planPrice}>R$ 0</div>
            <ul className={styles.planList}>
              {FREE_ITEMS.map((item) => (
                <li key={item} className={styles.planItem}>
                  <span className={styles.check}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <button type="button" className={styles.planCta} onClick={() => onStart('pricing')}>
              Começar grátis
            </button>
          </div>

          <div className={`${styles.planCard} ${styles.planCardPremium}`}>
            <div className={styles.planBadge}>Premium</div>
            <div className={styles.planName}>Premium</div>
            <div className={styles.planPrice}>
              R$ 19,90<span className={styles.planPeriod}>/mês</span>
            </div>
            <ul className={styles.planList}>
              {PREMIUM_ITEMS.map((item) => (
                <li key={item} className={styles.planItem}>
                  <span className={styles.check}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className={styles.planNote}>Assine quando quiser, direto no seu perfil, depois de criar a conta.</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <button type="button" className={styles.footerLink} onClick={onOpenPrivacidade}>
            Política de Privacidade
          </button>
          <button type="button" className={styles.footerLink} onClick={onOpenTermos}>
            Termos de Uso
          </button>
        </div>
        <p className={styles.footerNote}>
          CNH Pista não é afiliado ao Detran. Contato: suporte@comunidadecutpro.com
        </p>
      </footer>
    </div>
  )
}
