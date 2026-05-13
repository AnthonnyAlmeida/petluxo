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
            Última atualização: maio de 2025
          </p>

          <p style={{ lineHeight: 1.8, marginBottom: '2rem' }}>
            Na PetLuxo, a privacidade e a segurança dos dados dos nossos clientes são prioridades.
            Todas as informações pessoais tratadas por nós são utilizadas exclusivamente para
            processar e entregar seus pedidos com segurança e agilidade.
          </p>

          <Section title="Coleta de Informações">
            <p>
              Não coletamos dados pessoais diretamente pelo site. Após a conclusão de uma compra
              pelo PagBank, recebemos as seguintes informações necessárias para o processamento e
              entrega do pedido:
            </p>
            <ul>
              <li>Nome completo</li>
              <li>Endereço de entrega</li>
              <li>Telefone de contato</li>
            </ul>
            <p>
              Dados financeiros como cartão, CPF e informações de pagamento são coletados e
              processados exclusivamente pelo PagBank, sujeitos à{' '}
              <a
                href="https://pagseguro.uol.com.br/sobre/politica-de-privacidade"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Privacidade do PagBank
              </a>.
            </p>
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
              <li><strong>PagBank</strong> — processamento do pagamento</li>
              <li><strong>Distribuidor parceiro</strong> — recebe nome e endereço para realizar o envio direto ao cliente</li>
              <li><strong>Autoridades competentes</strong> — quando exigido por lei</li>
            </ul>
          </Section>

          <Section title="Cookies e Google Analytics">
            <p>
              Utilizamos cookies do Google Analytics para analisar o tráfego do site de forma
              anônima (páginas visitadas, origem do acesso). Nenhum dado pessoal identificável é
              coletado por essa ferramenta. Você pode desativar os cookies do Google Analytics a
              qualquer momento em:{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
              >
                tools.google.com/dlpage/gaoptout
              </a>
              , ou nas configurações de cookies do seu navegador.
            </p>
          </Section>

          <Section title="Segurança dos Dados">
            <p>
              Adotamos medidas razoáveis de segurança técnica e organizacional para proteger as
              informações recebidas. Os dados de entrega são utilizados exclusivamente para a
              finalidade descrita nesta política e não são armazenados em sistemas além do e-mail
              institucional da PetLuxo.
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
                <strong>Legítimo interesse</strong> — para análise de tráfego via Google Analytics
                (Art. 7º, IX da Lei 13.709/2019)
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
