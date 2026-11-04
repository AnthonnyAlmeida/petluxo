/* PetLuxo — Política de Privacidade */

import React from 'react';
import { Navbar } from '../layout/Navbar.jsx';
import { Footer } from '../layout/Footer.jsx';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: 'clamp(48px, 8vw, 96px) var(--pad)',
          fontFamily: 'var(--sans)',
          color: 'var(--ink)',
        }}>
          <h1 style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 600,
            color: 'var(--vinho)',
            marginBottom: '0.5rem',
            lineHeight: 1.2,
          }}>
            Política de Privacidade
          </h1>
          <p style={{
            color: 'var(--ink-soft)',
            fontSize: '0.875rem',
            marginBottom: '2.5rem',
            borderBottom: '1px solid var(--bege)',
            paddingBottom: '1.5rem',
          }}>
            Última atualização: novembro de 2026
          </p>

          <p style={{ lineHeight: 1.8, marginBottom: '2rem' }}>
            Na PetLuxo, a privacidade e a segurança dos dados dos nossos clientes são prioridades.
            Todas as informações pessoais tratadas por nós são utilizadas exclusivamente para
            processar e entregar seus pedidos com segurança e agilidade.
          </p>

          <Section title="Coleta de Informações">
            <p>
              Não coletamos dados pessoais diretamente pelo site, que não possui formulários nem
              pagamento. O atendimento e o pedido são combinados pelo WhatsApp, e o pagamento é
              feito por Pix ou por link de pagamento combinado no atendimento. Os dados que você
              informar na conversa são usados para processar e entregar o pedido:
            </p>
            <ul>
              <li>Nome completo</li>
              <li>Endereço de entrega</li>
              <li>Telefone de contato</li>
            </ul>
          </Section>

          <Section title="Como Usamos Seus Dados">
            <p>As informações recebidas são utilizadas para:</p>
            <ul>
              <li>Processar e confirmar seu pedido</li>
              <li>Repassar o endereço de entrega ao distribuidor responsável pelo envio</li>
              <li>Prestar suporte ao cliente quando necessário</li>
            </ul>
          </Section>

          <Section title="Compartilhamento de Informações">
            <p>
              A PetLuxo não vende nem aluga dados pessoais. Compartilhamos apenas o necessário
              para a entrega do pedido:
            </p>
            <ul>
              <li><strong>WhatsApp (Meta)</strong> — canal de atendimento e combinação do pedido</li>
              <li><strong>PagBank</strong> — operador do link de pagamento por cartão, gerado no atendimento quando o cliente escolhe essa forma; os dados do cartão são tratados pelo PagBank, não pelo site nem pela PetLuxo</li>
              <li><strong>Cloudflare</strong> — hospedagem do site</li>
              <li><strong>Distribuidor parceiro</strong> — recebe nome e endereço para realizar o envio direto ao cliente</li>
              <li><strong>Autoridades competentes</strong> — quando exigido por lei</li>
            </ul>
          </Section>

          <Section title="Cookies e Google Analytics">
            <p>
              O site utiliza o Google Analytics (GA4) para analisar o tráfego
              (páginas visitadas, origem do acesso). O carregamento do
              rastreamento depende do seu consentimento: ele só é iniciado
              quando você aceita explicitamente por meio do banner de
              consentimento apresentado no site, e pode ser recusado ou revogado a qualquer
              momento.
            </p>
            <p>
              Não afirmamos que os dados coletados pelo Google Analytics são
              anônimos, nem garantimos a eficácia de ferramentas externas de
              desativação (como o link de opt-out do Google) para o GA4. Se
              desejar revisar ou revogar sua escolha de analytics, use o link{' '}
              <strong>Preferências de cookies</strong> no rodapé do
              site ou entre em contato pelo e-mail abaixo.
            </p>
            <p>
              Independentemente do banner de consentimento, o site carrega fontes do Google
              Fonts, o que envia o endereço IP do visitante ao Google.
            </p>
            <p>
              Para controlar cookies de forma geral, utilize as configurações
              do seu navegador.
            </p>
          </Section>

          <Section title="Segurança dos Dados">
            <p>
              Adotamos medidas razoáveis de segurança técnica e organizacional para proteger as
              informações recebidas. Os dados de entrega são utilizados exclusivamente para a
              finalidade descrita nesta política. Os dados que você informa no atendimento são
              recebidos e ficam na conversa do WhatsApp.
            </p>
          </Section>

          <Section title="Base Legal (LGPD)">
            <p>O tratamento de dados pessoais pela PetLuxo ocorre com base em:</p>
            <ul>
              <li>
                <strong>Execução de contrato</strong> — para processar e entregar o pedido
                realizado (Art. 7º, V da Lei 13.709/2019)
              </li>
              <li>
                <strong>Consentimento</strong> — para análise de tráfego via Google
                Analytics (GA4), coletado por meio do banner de consentimento do site.
                Você pode aceitar, recusar ou revogar essa escolha a qualquer momento.
                A definição definitiva entre consentimento e legítimo interesse para
                analytics ainda depende de confirmação jurídica.
              </li>
            </ul>
          </Section>

          <Section title="Direitos do Usuário">
            <p>Você pode a qualquer momento solicitar:</p>
            <ul>
              <li>Acesso aos seus dados pessoais que mantemos</li>
              <li>Correção de dados incorretos</li>
              <li>Exclusão dos seus dados após a conclusão do pedido</li>
            </ul>
            <p>Entre em contato pelo e-mail abaixo para exercer esses direitos.</p>
          </Section>

          <Section title="Contato">
            <p>CNPJ: 23.833.930/0001-21</p>
            <p>
              <a href="mailto:petluxo.service@gmail.com">petluxo.service@gmail.com</a>
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h2 style={{
        fontFamily: 'var(--serif)',
        fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
        fontWeight: 600,
        color: 'var(--vinho)',
        marginBottom: '0.75rem',
        lineHeight: 1.3,
      }}>
        {title}
      </h2>
      <div style={{
        lineHeight: 1.8,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        {children}
      </div>
    </section>
  );
}
