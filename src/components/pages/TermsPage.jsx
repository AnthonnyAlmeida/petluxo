/* PetLuxo — Termos de Uso */

import PolicyLayout, { Section } from './PolicyLayout.jsx';


export default function TermsPage() {
  return (
    <PolicyLayout
      title="Termos de Uso"
      updated="novembro de 2026"
    >
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
          produtos a qualquer momento. Alterações não afetam pedidos já confirmados,
          que serão processados conforme as condições vigentes no momento da confirmação.
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
          O site pode conter redirecionamentos para plataformas externas, como o
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
    </PolicyLayout>
  );
}
