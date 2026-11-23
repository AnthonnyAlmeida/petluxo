/* PetLuxo — Termos de Uso */

import PolicyLayout, { Section } from './PolicyLayout.jsx';

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Termos de Uso"
      updated="novembro de 2026"
    >
      <p style={{ lineHeight: 1.8, marginBottom: '2rem' }}>
        Ao acessar o site da PetLuxo (www.petluxostory.com.br), o usuário concorda com as condições abaixo.
      </p>

      <Section title="Uso do Conteúdo">
        <p>
          Todo o conteúdo do site (textos, imagens, logotipos) é protegido por direitos
          autorais. É proibida a reprodução comercial sem autorização prévia.
        </p>
      </Section>

      <Section title="Responsabilidade">
        <p>
          A PetLuxo compromete-se a intermediar e garantir a qualidade dos produtos e entregas
          em conjunto com seus parceiros logísticos, assegurando todos os direitos previstos no
          Código de Defesa do Consumidor.
        </p>
      </Section>

      <Section title="Foro">
        <p>
          Para dirimir eventuais controvérsias oriundas destes termos, fica eleito o foro do
          domicílio do consumidor, em total respeito às normas protetivas do Código de Defesa do
          Consumidor.
        </p>
      </Section>

      <p>
        Contato: <a href="mailto:petluxo.service@gmail.com">petluxo.service@gmail.com</a> |{' '}
        <a
            href="https://wa.me/5561994063917"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp: (61) 99406-3917
          </a>
      </p>
    </PolicyLayout>
  );
}
