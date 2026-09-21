import PhoneFrame from '../components/PhoneFrame'
import styles from './LegalDoc.module.css'

export default function Privacidade({ onBack }) {
  return (
    <PhoneFrame label="Política de Privacidade">
      <div className={styles.wrap}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Política de Privacidade</h1>
          <button type="button" className={styles.backLink} onClick={onBack}>
            voltar
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.updated}>Última atualização: 21 de setembro de 2026.</p>

          <section className={styles.section}>
            <h2>1. Quem trata os seus dados</h2>
            <p>
              O CNH Pista é operado por Carlos Henrique Oliveira, pessoa física, que atua como controlador dos dados
              pessoais tratados neste aplicativo, nos termos da Lei nº 13.709/2018 (Lei Geral de Proteção de Dados —
              LGPD). Para qualquer assunto relacionado à privacidade dos seus dados, entre em contato pelo e-mail{' '}
              <strong>suporte@comunidadecutpro.com</strong>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Quais dados coletamos</h2>
            <ul>
              <li>Seu e-mail, usado para criar sua conta e para login (não usamos senha, apenas link/código enviado por e-mail).</li>
              <li>Nome de exibição, se você informar um.</li>
              <li>Respostas do diagnóstico inicial e dos simulados, para calcular seu nível de preparo por categoria.</li>
              <li>Progresso de estudo: questões erradas, macetes salvos, quantidade de simulados feitos.</li>
              <li>Status da sua assinatura (ativa, pendente, cancelada) e identificador da assinatura no Mercado Pago.</li>
              <li>
                Eventos de uso do app (por exemplo: visita à página inicial, início do fluxo de assinatura),
                associados a um identificador de sessão anônimo e, quando você está logado, à sua conta — usamos isso
                para entender se o produto está funcionando, não para publicidade.
              </li>
            </ul>
            <p>
              <strong>Nós nunca temos acesso ao número do seu cartão ou a outros dados de pagamento.</strong> Esses
              dados são digitados diretamente na página do Mercado Pago e tratados exclusivamente por eles.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Para que usamos esses dados</h2>
            <ul>
              <li>Autenticar seu acesso e manter sua conta funcionando (execução de contrato).</li>
              <li>Personalizar seu plano de estudo com base no seu desempenho (execução de contrato).</li>
              <li>Processar sua assinatura Premium e confirmar pagamentos (execução de contrato).</li>
              <li>Enviar o e-mail de login e comunicações essenciais sobre sua conta (execução de contrato).</li>
              <li>Cumprir obrigações legais e fiscais, quando aplicável (obrigação legal).</li>
              <li>Entender como as pessoas usam o app para melhorar o produto e a conversão (interesse legítimo).</li>
            </ul>
            <p>Não usamos seus dados para publicidade e não vendemos seus dados a terceiros.</p>
          </section>

          <section className={styles.section}>
            <h2>4. Com quem compartilhamos</h2>
            <p>Seus dados são compartilhados apenas com prestadores de serviço que ajudam a operar o app:</p>
            <ul>
              <li><strong>Supabase</strong> — hospedagem do banco de dados e autenticação.</li>
              <li><strong>Mercado Pago</strong> — processamento de pagamentos e da assinatura recorrente.</li>
              <li><strong>Resend</strong> — envio dos e-mails de login (link/código de acesso).</li>
            </ul>
            <p>Cada um desses prestadores trata seus dados apenas para prestar o serviço contratado, sob suas próprias políticas de segurança.</p>
          </section>

          <section className={styles.section}>
            <h2>5. Por quanto tempo guardamos seus dados</h2>
            <p>
              Mantemos seus dados enquanto sua conta estiver ativa. Se você pedir a exclusão da conta, apagamos seus
              dados pessoais em até 30 dias, exceto informações que precisemos manter por obrigação legal (por
              exemplo, registros fiscais de pagamento).
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Seus direitos (Art. 18 da LGPD)</h2>
            <p>Você pode, a qualquer momento, solicitar pelo e-mail <strong>suporte@comunidadecutpro.com</strong>:</p>
            <ul>
              <li>Confirmação de que tratamos seus dados e acesso a eles.</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
              <li>Exclusão dos seus dados pessoais.</li>
              <li>Portabilidade dos seus dados a outro fornecedor.</li>
              <li>Revogação do seu consentimento e informação sobre com quem compartilhamos seus dados.</li>
            </ul>
            <p>Respondemos a essas solicitações em até 15 dias.</p>
          </section>

          <section className={styles.section}>
            <h2>7. Cookies e armazenamento local</h2>
            <p>
              O app usa armazenamento local do navegador (localStorage) e cookies estritamente necessários para
              manter você logado e lembrar seu progresso entre sessões. Não usamos cookies de rastreamento
              publicitário.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Segurança</h2>
            <p>
              Adotamos medidas técnicas para proteger seus dados, como controle de acesso por linha (Row Level
              Security) no banco de dados, conexões criptografadas (HTTPS) e restrição de quais colunas podem ser
              alteradas diretamente pelo usuário.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Alterações desta política</h2>
            <p>
              Podemos atualizar esta política para refletir mudanças no app ou na legislação. A data no topo desta
              página sempre indica a versão mais recente.
            </p>
          </section>
        </div>
      </div>
    </PhoneFrame>
  )
}
