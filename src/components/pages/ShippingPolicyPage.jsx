/* PetLuxo — Política de Frete e Entrega */

import PolicyLayout, { Section } from './PolicyLayout.jsx';

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout
      title="Política de Frete e Entrega"
      updated="novembro de 2026"
    >
      <p style={{ lineHeight: 1.8, marginBottom: '2rem' }}>
        Na PetLuxo, trabalhamos em parceria com distribuidores logísticos qualificados para assegurar que o seu pedido chegue com total segurança e agilidade.
      </p>

      <Section title="Processamento e Prazos">
        <p>
          Os prazos de entrega variam conforme o produto e o fornecedor logístico, sendo
          informados de forma clara durante o atendimento via WhatsApp, antes da confirmação
          final do pedido.
        </p>
      </Section>

      <Section title="Frete">
        <p>
          O valor e as condições do frete são calculados e apresentados durante o atendimento,
          com base no endereço de entrega fornecido pelo cliente.
        </p>
      </Section>

      <Section title="Rastreamento">
        <p>
          Após o despacho pelo distribuidor parceiro, o código de rastreamento correspondente
          será enviado ao cliente por meio do WhatsApp.
        </p>
      </Section>

      <Section title="Endereço de Entrega e Imprevistos">
        <p>
          É de responsabilidade do cliente o preenchimento correto dos dados de envio. Caso haja
          divergência, o suporte deve ser acionado imediatamente pelo WhatsApp para tentarmos a
          correção antes do despacho. Eventuais atrasos logísticos decorrentes de força maior
          serão comunicados ativamente pela nossa equipe, que intermediará toda a solução junto
          à rede de distribuição.
        </p>
      </Section>

      <p>
        Contato: <a href="mailto:petluxo.service@gmail.com">petluxo.service@gmail.com</a> |{' '}
        <a
            href="https://wa.me/5561994063917" data-wa-origin="politica"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp: (61) 99406-3917
          </a>
      </p>
    </PolicyLayout>
  );
}
