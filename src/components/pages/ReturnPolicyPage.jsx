/* PetLuxo — Política de Troca e Devolução */

import PolicyLayout, { Section } from './PolicyLayout.jsx';

/* Cartões em destaque no mobile (7 e 90 dias). Conferidos com o texto do
 * advogado de 2026-11-19 (seção "Modalidades de Troca e Devolução":
 * arrependimento em até 7 dias corridos; defeito em até 90 dias, ambos a
 * contar do recebimento). Se a política mudar, atualizar junto. */
const HIGHLIGHTS = [
  { num: '7', text: 'dias corridos para desistir da compra, a contar do recebimento' },
  { num: '90', text: 'dias para defeito de fabricação, a contar do recebimento' },
];

export default function ReturnPolicyPage() {
  return (
    <PolicyLayout
      title="Política de Troca e Devolução"
      updated="novembro de 2026" highlights={HIGHLIGHTS}
    >
      <p style={{ lineHeight: 1.8, marginBottom: '2rem' }}>
        Queremos que você e seu pet tenham a melhor experiência com a PetLuxo.
      </p>

      <Section title="Modalidades de Troca e Devolução">
        <ul>
          <li>
            <strong>Arrependimento / Desistência da Compra:</strong> Até 7 (sete) dias corridos
            após o recebimento do produto (art. 49 do CDC). Na PetLuxo, arcamos com o custo do
            frete de devolução por arrependimento e restituímos integralmente os valores pagos
            (incluindo o frete original). O produto deve estar sem sinais de uso efetivo, sendo
            permitida a inspeção necessária para conhecer suas características.
          </li>
          <li>
            <strong>Vício ou Defeito de Fabricação:</strong> Até 90 (noventa) dias após o
            recebimento para produtos duráveis (art. 26 do CDC). O frete de retorno e reenvio é
            integralmente de responsabilidade da PetLuxo, e o cliente poderá optar entre a troca
            do produto ou o reembolso integral dos valores.
          </li>
          <li>
            <strong>Troca por Liberalidade:</strong> Caso o cliente deseje trocar o produto por
            motivos de preferência pessoal (como tamanho ou cor) fora do prazo de arrependimento,
            a possibilidade e as condições de frete serão avaliadas individualmente pelo
            atendimento via WhatsApp.
          </li>
        </ul>
      </Section>

      <Section title="Como Solicitar">
        <p>
          Como o nosso atendimento é humanizado e realizado via WhatsApp, basta entrar em contato
          conosco informando seu nome completo, dados de contato e fotos do produto (em caso de
          defeito), sem burocracia com números de pedido complexos:
        </p>
        <p>
          E-mail: <a href="mailto:petluxo.service@gmail.com">petluxo.service@gmail.com</a>
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
          Nossa equipe orientará sobre o procedimento de postagem reversa e o respectivo
          reembolso ou troca.
        </p>
      </Section>
    </PolicyLayout>
  );
}
