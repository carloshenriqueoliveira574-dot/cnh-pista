import PhoneFrame from '../components/PhoneFrame'
import styles from './LegalDoc.module.css'

export default function Termos({ onBack }) {
  return (
    <PhoneFrame label="Termos de Uso">
      <div className={styles.wrap}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Termos de Uso</h1>
          <button type="button" className={styles.backLink} onClick={onBack}>
            voltar
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.updated}>Última atualização: 17 de setembro de 2026.</p>

          <section className={styles.section}>
            <h2>1. Sobre o serviço</h2>
            <p>
              O CNH Pista é um aplicativo de estudo para a prova teórica do DETRAN, operado por Carlos Henrique
              Oliveira, pessoa física. Ao criar uma conta, você concorda com estes Termos de Uso e com a nossa
              Política de Privacidade.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Planos e assinatura Premium</h2>
            <p>
              O CNH Pista oferece um plano gratuito com acesso limitado e um plano Premium, cobrado no valor de{' '}
              <strong>R$ 19,90 por mês</strong>, com renovação automática mensal, processado pelo Mercado Pago.
            </p>
            <p>
              Ao assinar, você concorda com a cobrança recorrente mensal até que a assinatura seja cancelada.
              Atualmente o cancelamento é feito diretamente pelo Mercado Pago, na área de assinaturas da sua conta
              Mercado Pago — ainda não existe um botão de cancelamento dentro do app. Se tiver dificuldade para
              cancelar, escreva para <strong>suporte@comunidadecutpro.com</strong> que ajudamos.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Direito de arrependimento</h2>
            <p>
              Nos termos do Art. 49 do Código de Defesa do Consumidor, se você assinou o plano Premium fora de um
              estabelecimento comercial (ou seja, pela internet), você tem até <strong>7 dias corridos</strong> a
              partir da contratação para desistir e pedir reembolso integral, sem precisar justificar o motivo.
              Basta escrever para <strong>suporte@comunidadecutpro.com</strong>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Uso do aplicativo</h2>
            <ul>
              <li>Você é responsável por manter o acesso ao seu e-mail de cadastro, já que o login é feito por link/código enviado por e-mail.</li>
              <li>O conteúdo do app (questões, explicações, macetes) é de uso pessoal, não podendo ser copiado ou redistribuído comercialmente.</li>
              <li>Nos reservamos o direito de suspender contas que utilizem o app de forma abusiva ou fraudulenta.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Isenção de responsabilidade</h2>
            <p>
              O CNH Pista é uma ferramenta de apoio ao estudo e <strong>não garante aprovação</strong> na prova
              teórica do DETRAN. O conteúdo é baseado na legislação de trânsito vigente, mas pode conter
              imprecisões — em caso de dúvida, consulte sempre a legislação oficial e o edital do seu DETRAN
              estadual.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Alterações no serviço e nestes termos</h2>
            <p>
              Podemos alterar funcionalidades do app e estes Termos a qualquer momento. Mudanças relevantes serão
              comunicadas por e-mail ou dentro do próprio app. O uso continuado após uma alteração significa que
              você concorda com os novos termos.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Lei aplicável e foro</h2>
            <p>
              Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro do domicílio do consumidor para
              dirimir eventuais conflitos, conforme o Código de Defesa do Consumidor.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Contato</h2>
            <p>
              Dúvidas sobre estes Termos podem ser enviadas para <strong>suporte@comunidadecutpro.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </PhoneFrame>
  )
}
