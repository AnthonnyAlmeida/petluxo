/* PetLuxo — Política de Frete e Entrega */

import React from 'react';
import { Navbar } from '../layout/Navbar.jsx';
import { Footer } from '../layout/Footer.jsx';

export default function ShippingPolicyPage() {
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
            Política de Frete e Entrega
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
            Na PetLuxo, trabalhamos para garantir uma entrega segura e eficiente para você e seu pet.
          </p>

          <Section title="Processamento do Pedido">
            <p>
              Os pedidos são processados em até 5 dias úteis após a confirmação do pagamento.
              Durante esse período, realizamos a verificação do pedido e o repasse ao distribuidor
              responsável pelo envio.
            </p>
          </Section>

          <Section title="Prazo de Entrega">
            <p>
              Após o despacho, o prazo estimado de entrega é de 7 a 15 dias úteis, podendo variar
              conforme a região de destino e a modalidade de frete disponível para o pedido.
            </p>
          </Section>

          <Section title="Frete">
            <p>
              O valor do frete é calculado automaticamente pelo PagBank no momento da compra, com
              base no endereço de entrega informado.
            </p>
          </Section>

          <Section title="Rastreamento">
            <p>
              Quando disponível, o código de rastreamento será enviado por e-mail assim que o
              pedido for despachado pelo distribuidor. Em caso de dúvida sobre o status do seu
              pedido, entre em contato pelo e-mail ou WhatsApp informados abaixo.
            </p>
          </Section>

          <Section title="Possíveis Atrasos">
            <p>
              Fatores externos como greves, períodos de alta demanda (como datas comemorativas) ou
              condições climáticas podem impactar o prazo de entrega. Nesses casos, faremos o
              possível para manter o cliente informado.
            </p>
          </Section>

          <Section title="Endereço de Entrega">
            <p>
              É responsabilidade do cliente preencher corretamente os dados de entrega no momento
              da compra. Caso perceba algum erro após a finalização, entre em contato o mais
              rápido possível pelos canais abaixo — antes do despacho, podemos tentar corrigir.
            </p>
          </Section>

          <Section title="Pedido não Recebido">
            <p>
              Se o prazo de entrega for ultrapassado e o pedido não tiver sido recebido, entre em
              contato com nossa equipe para que possamos verificar o status junto ao distribuidor.
            </p>
          </Section>

          <Section title="Contato">
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
