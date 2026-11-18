/* PetLuxo — Política de Frete e Entrega */

import PolicyLayout, { Section } from './PolicyLayout.jsx';


export default function ShippingPolicyPage() {
  return (
    <PolicyLayout
      title="Política de Frete e Entrega"
      updated="novembro de 2026"
    >
      <p style={{ lineHeight: 1.8, marginBottom: '2rem' }}>
        Na PetLuxo, trabalhamos para garantir uma entrega segura e eficiente para você e seu pet.
      </p>

      <Section title="Processamento do Pedido">
        <p>
          Após a confirmação do pedido e do pagamento, realizamos a verificação do pedido e o
          repasse ao distribuidor responsável pelo envio. O prazo varia conforme o produto e o
          fornecedor e é informado no atendimento, antes da confirmação do pedido.
        </p>
      </Section>

      <Section title="Prazo de Entrega">
        <p>
          O prazo varia conforme o produto e o fornecedor e é informado no atendimento, antes
          da confirmação do pedido.
        </p>
      </Section>

      <Section title="Frete">
        <p>
          O valor e as condições do frete são informados durante o atendimento pelo WhatsApp,
          antes da confirmação do pedido, com base no endereço de entrega informado.
        </p>
      </Section>

      <Section title="Rastreamento">
        <p>
          Quando existir, o código de rastreamento será enviado pelo WhatsApp assim que o
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
          É responsabilidade do cliente informar corretamente os dados de entrega durante o
          atendimento pelo WhatsApp. Caso perceba algum erro após a finalização, entre em
          contato o mais rápido possível pelos canais abaixo — antes do despacho, podemos
          tentar corrigir.
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
    </PolicyLayout>
  );
}
