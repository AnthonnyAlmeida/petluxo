/* PetLuxo — Política de Privacidade */

import PolicyLayout, { Section } from './PolicyLayout.jsx';

export default function PrivacyPage() {
  return (
    <PolicyLayout
      title="Política de Privacidade"
      updated="novembro de 2026"
    >
      <p style={{ lineHeight: 1.8, marginBottom: '2rem' }}>
        Na PetLuxo, a privacidade e a segurança dos dados dos nossos clientes são prioridades. Todas as informações pessoais tratadas por nós são utilizadas com transparência para processar e entregar seus pedidos, prestar suporte e garantir a eficiência da nossa operação.
      </p>

      <Section title="Identificação do Controlador">
        <p>Razão Social: DANIELE ALMEIDA DE SOUZA</p>
        <p>CNPJ: 23.833.930/0001-21</p>
        <p>Endereço: SMPW Quadra 3, Conjunto 2, Lote 8, Casa E, Brasília/DF</p>
        <p>Canal de Privacidade: <a href="mailto:petluxo.service@gmail.com">petluxo.service@gmail.com</a></p>
      </Section>

      <Section title="Coleta de Informações">
        <p>
          O atendimento e a finalização de pedidos ocorrem por meio de atendimento personalizado
          via WhatsApp, com pagamentos realizados via Pix ou link seguro. Os dados informados
          pelo cliente durante a conversa são utilizados para viabilizar a compra, a entrega e o
          suporte pós-venda:
        </p>
        <ul>
          <li>Nome completo</li>
          <li>Endereço de entrega</li>
          <li>Telefone de contato</li>
        </ul>
      </Section>

      <Section title="Como Usamos Seus Dados">
        <ul>
          <li>Processar e confirmar seu pedido;</li>
          <li>Repassar os dados logísticos necessários ao distribuidor responsável pelo envio;</li>
          <li>Prestar suporte, atendimento ao cliente e gerenciar trocas ou devoluções.</li>
        </ul>
      </Section>

      <Section title="Compartilhamento de Informações e Transferência Internacional">
        <p>
          A PetLuxo não vende nem aluga dados pessoais. Compartilhamos apenas o necessário com
          parceiros essenciais à operação, que podem armazenar dados em servidores internacionais
          (transferência internacional):
        </p>
        <ul>
          <li><strong>WhatsApp (Meta):</strong> Canal de atendimento e combinação de pedidos.</li>
          <li><strong>Google:</strong> Ferramentas de análise de tráfego e métricas (GA4).</li>
          <li><strong>PagBank:</strong> Operador de pagamentos (os dados de cartão são processados diretamente pelo PagBank, sem armazenamento pela PetLuxo).</li>
          <li><strong>Cloudflare:</strong> Hospedagem e segurança da infraestrutura do site.</li>
          <li><strong>Distribuidor parceiro:</strong> Recebe nome e endereço de entrega para realizar a postagem direta ao cliente.</li>
          <li><strong>Autoridades competentes:</strong> Quando exigido por ordem legal ou regulatória.</li>
        </ul>
      </Section>

      <Section title="Cookies e Google Analytics">
        <p>
          O site utiliza o Google Analytics (GA4) para análise de tráfego. O carregamento das
          tags de rastreamento só é iniciado após o consentimento explícito do visitante,
          manifestado por meio do banner de cookies do site. O usuário pode gerenciar, recusar ou
          revogar sua preferência a qualquer momento clicando no link "Preferências de cookies"
          no rodapé ou entrando em contato pelo e-mail <a href="mailto:petluxo.service@gmail.com">petluxo.service@gmail.com</a>.
        </p>
      </Section>

      <Section title="Base Legal (LGPD)">
        <p>
          O tratamento de dados fundamenta-se na execução de contrato (Art. 7º, V da Lei nº
          13.709/2019) para processamento dos pedidos, e no consentimento do usuário para a
          coleta de métricas de tráfego via Google Analytics.
        </p>
      </Section>

      <Section title="Prazos de Retenção de Dados">
        <p>
          Os dados pessoais serão mantidos apenas pelo tempo necessário para cumprir as
          finalidades para os quais foram coletados:
        </p>
        <ul>
          <li><strong>Dados de entrega:</strong> utilizados estritamente para a postagem, sendo eliminados ou anonimizados após a conclusão do envio e o encerramento do prazo de garantia.</li>
          <li><strong>Registros de atendimento e histórico de conversas de WhatsApp:</strong> armazenados por 5 anos, para fins de resguardo de direitos civis e de consumo.</li>
          <li><strong>Comprovantes de pagamento e dados fiscais:</strong> armazenados por 5 anos (obrigações tributárias e legais).</li>
        </ul>
      </Section>

      <Section title="Direitos do Titular (Art. 18 da LGPD)">
        <p>Você pode, a qualquer momento, solicitar à PetLuxo:</p>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <li>I. Confirmação da existência de tratamento;</li>
          <li>II. Acesso aos dados;</li>
          <li>III. Correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>IV. Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
          <li>V. Portabilidade dos dados a outro fornecedor;</li>
          <li>VI. Eliminação dos dados tratados com consentimento;</li>
          <li>VII. Informação das entidades públicas e privadas com as quais compartilhamos dados;</li>
          <li>VIII. Informação sobre a possibilidade de não fornecer consentimento e suas consequências;</li>
          <li>IX. Revogação do consentimento;</li>
          <li>X. Oposição ao tratamento realizado com fundamento em uma das hipóteses de dispensa de consentimento, em caso de descumprimento ao disposto na LGPD.</li>
        </ul>
        <p>Para exercer qualquer um dos direitos, envie um e-mail para <a href="mailto:petluxo.service@gmail.com">petluxo.service@gmail.com</a>.</p>
      </Section>

      <Section title="Segurança dos Dados">
        <p>
          Adotamos medidas técnicas e organizacionais adequadas para proteger as informações
          contra acesso não autorizado, perda ou alteração.
        </p>
      </Section>

      <Section title="Menores de Idade">
        <p>
          Nossos produtos e atendimento são voltados para o público adulto. Não coletamos
          intencionalmente dados de menores de idade.
        </p>
      </Section>

      <Section title="Alterações nesta Política">
        <p>
          Reservamo-nos o direito de atualizar esta Política de Privacidade a qualquer momento
          para refletir melhorias operacionais ou exigências legais. Recomendamos revisá-la
          periodicamente.
        </p>
      </Section>
    </PolicyLayout>
  );
}
