/* PetLuxo — Política de Troca e Devolução */

import React from 'react';
import { Navbar } from '../layout/Navbar.jsx';
import { Footer } from '../layout/Footer.jsx';

export default function ReturnPolicyPage() {
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
            Política de Troca e Devolução
          </h1>
          <p style={{
            color: 'var(--ink-soft)',
            fontSize: '0.875rem',
            marginBottom: '2.5rem',
            borderBottom: '1px solid var(--bege)',
            paddingBottom: '1.5rem',
          }}>
            Última atualização: maio de 2025
          </p>

          <p style={{ lineHeight: 1.8, marginBottom: '2rem' }}>
            A PetLuxo deseja proporcionar a melhor experiência possível para você e seu pet. Caso
            precise solicitar uma troca ou devolução, estamos à disposição para ajudar.
          </p>

          <Section title="Prazo para Solicitação">
            <ul>
              <li>
                <strong>Arrependimento (desistência da compra):</strong> até 7 dias corridos após
                o recebimento do produto, conforme o Art. 49 do Código de Defesa do Consumidor.
              </li>
              <li>
                <strong>Defeito de fabricação:</strong> até 90 dias após o recebimento, conforme
                o Art. 26 do CDC para produtos duráveis.
              </li>
            </ul>
          </Section>

          <Section title="Condições para Troca ou Devolução">
            <p>O produto deve:</p>
            <ul>
              <li>Estar sem sinais de uso</li>
              <li>Conter embalagem original</li>
              <li>Possuir todos os acessórios incluídos</li>
            </ul>
            <p>
              Produtos que apresentem defeito de fabricação comprovado são aceitos
              independentemente das condições acima.
            </p>
          </Section>

          <Section title="Frete de Devolução">
            <ul>
              <li>
                <strong>Em caso de arrependimento:</strong> o frete de retorno é de
                responsabilidade do cliente.
              </li>
              <li>
                <strong>Em caso de defeito de fabricação:</strong> o frete de retorno é de
                responsabilidade da PetLuxo.
              </li>
            </ul>
          </Section>

          <Section title="Como Solicitar">
            <p>Entre em contato pelos canais abaixo informando:</p>
            <ul>
              <li>Número do pedido</li>
              <li>Nome completo</li>
              <li>Motivo da solicitação</li>
              <li>Fotos do produto (quando aplicável)</li>
            </ul>
            <p>
              <a href="mailto:petluxo.service@gmail.com">petluxo.service@gmail.com</a>
            </p>
            <p>
              <a
                href="https://wa.me/5561994063917"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp: (61) 99406-3917
              </a>
            </p>
            <p>
              Após a análise da solicitação, nossa equipe entrará em contato para combinar os
              detalhes do processo de devolução e envio.
            </p>
          </Section>

          <Section title="Reembolso">
            <p>
              O reembolso será processado após a conclusão da análise da solicitação. O prazo e o
              método serão informados no atendimento, de acordo com cada caso e com o método de
              pagamento utilizado na compra.
            </p>
          </Section>

          <Section title="Observações">
            <p>
              Produtos que já foram utilizados somente serão aceitos para troca ou devolução em
              caso de defeito de fabricação comprovado.
            </p>
            <p>
              A PetLuxo reserva-se o direito de avaliar cada solicitação individualmente, sempre
              respeitando os direitos garantidos pelo Código de Defesa do Consumidor.
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
