/* PetLuxo — Termos de Uso */

import React from 'react';
import { Navbar } from '../layout/Navbar.jsx';
import { Footer } from '../layout/Footer.jsx';

export default function TermsPage() {
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
            Termos de Uso
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
            Ao acessar e utilizar o site da PetLuxo, o usuário declara que leu, compreendeu e
            concorda com os termos e condições abaixo. Caso não concorde, recomendamos que não
            utilize o site.
          </p>

          <Section title="Uso do Site">
            <p>
              O conteúdo presente no site da PetLuxo — incluindo textos, imagens, logotipos e
              descrições de produtos — é protegido por direitos autorais. É permitido o uso
              pessoal e não comercial, como compartilhar links e salvar imagens para referência
              própria. A reprodução, cópia ou distribuição para fins comerciais sem autorização
              prévia é proibida.
            </p>
          </Section>

          <Section title="Produtos e Informações">
            <p>
              A PetLuxo reserva-se o direito de alterar preços, descrições e disponibilidade dos
              produtos a qualquer momento. Alterações não afetam pedidos já confirmados e pagos,
              que serão processados conforme as condições vigentes no momento da compra.
            </p>
          </Section>

          <Section title="Conduta do Usuário">
            <p>
              O site da PetLuxo deve ser utilizado exclusivamente para fins lícitos. É proibido
              utilizar o site para práticas ilegais, tentativas de fraude, envio de spam ou
              qualquer ação que prejudique outros usuários ou a operação do site.
            </p>
          </Section>

          <Section title="Responsabilidade">
            <p>A PetLuxo não se responsabiliza por:</p>
            <ul>
              <li>Uso inadequado dos produtos adquiridos</li>
              <li>Dados de entrega preenchidos incorretamente pelo cliente</li>
              <li>Atrasos causados por fatores externos como greves, condições climáticas ou alta demanda</li>
            </ul>
            <p>
              Em casos de problemas relacionados à entrega, a PetLuxo se compromete a intermediar
              a resolução junto ao distribuidor responsável, respeitando os direitos garantidos
              pelo Código de Defesa do Consumidor.
            </p>
          </Section>

          <Section title="Links Externos">
            <p>
              O site pode conter redirecionamentos para plataformas externas como PagBank e
              WhatsApp. A PetLuxo não se responsabiliza pelo conteúdo, políticas ou práticas
              dessas plataformas, que possuem seus próprios termos de uso.
            </p>
          </Section>

          <Section title="Alterações nos Termos">
            <p>
              A PetLuxo reserva-se o direito de atualizar estes termos a qualquer momento. O uso
              continuado do site após alterações implica a aceitação dos novos termos.
            </p>
          </Section>

          <Section title="Foro">
            <p>
              Fica eleito o foro da comarca de Brasília/DF para dirimir quaisquer questões
              oriundas destes termos, com renúncia a qualquer outro, por mais privilegiado que
              seja.
            </p>
          </Section>

          <Section title="Contato">
            <p>Em caso de dúvidas:</p>
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
