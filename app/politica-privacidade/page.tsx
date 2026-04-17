import { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Política de Privacidade - Clínica do Empresário',
  description: 'Política de Privacidade da Clínica do Empresário — como tratamos os seus dados pessoais.',
}

function FallbackContent() {
  return (
    <>
      <p className="text-sm text-gray-500 mb-8">
        <strong>Última atualização:</strong> 07 de abril de 2026
      </p>

      <p className="mb-4">
        A presente Política de Privacidade explica como a <strong>Clínica do Empresário, Unipessoal Lda</strong> trata os dados pessoais dos utilizadores do website www.clinicadoempresario.pt, da loja online, da área reservada, da plataforma de gestão documental, dos formulários eletrónicos e dos serviços associados.
      </p>
      <p className="mb-8">
        A Clínica do Empresário compromete-se a tratar os dados pessoais em conformidade com o Regulamento (UE) 2016/679 (RGPD), a Lei n.º 58/2019, a Lei n.º 41/2004, e demais legislação aplicável em matéria de proteção de dados, comunicações eletrónicas e comércio eletrónico.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Responsável pelo Tratamento</h2>
        <p>O responsável pelo tratamento dos dados pessoais é:</p>
        <div className="bg-gray-50 rounded-lg p-4 my-4">
          <p className="font-semibold">Clínica do Empresário, Unipessoal Lda</p>
          <p>NIPC: 518715590</p>
          <p>Sede: Rua do Marquês 14 (StartUp Angra), Sé, 9700-117 Angra do Heroísmo</p>
          <p>Email geral: geral@clinicadoempresario.pt</p>
          <p>Email para assuntos de privacidade: geral@clinicadoempresario.pt</p>
          <p>Telefone: +351 968 621 639 (Chamada para rede móvel nacional)</p>
        </div>
        <p>Para qualquer questão relacionada com esta Política ou com o tratamento dos teus dados pessoais, podes contactar-nos através dos meios acima indicados.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Âmbito</h2>
        <p>A presente Política aplica-se ao tratamento de dados pessoais recolhidos através:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>do website institucional;</li>
          <li>da loja online;</li>
          <li>da criação e gestão de conta de utilizador;</li>
          <li>de formulários de contacto, pedido de informação, agendamento e proposta;</li>
          <li>da subscrição de newsletter e comunicações de marketing;</li>
          <li>da plataforma de gestão documental;</li>
          <li>de ferramentas digitais disponibilizadas no website;</li>
          <li>de cookies, pixels, tags e outras tecnologias de rastreamento;</li>
          <li>de comunicações por email, telefone, mensagens ou outros meios relacionados com os serviços prestados.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Categorias de Dados Pessoais Tratados</h2>
        <p className="mb-4">Podemos tratar, consoante a relação estabelecida contigo, as seguintes categorias de dados:</p>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3.1. Dados de identificação e contacto</h3>
        <ul className="list-disc pl-6"><li>nome; apelido; empresa ou entidade; cargo/função; endereço de email; número de telefone; morada; NIF, quando necessário.</li></ul>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3.2. Dados de conta de utilizador</h3>
        <ul className="list-disc pl-6"><li>nome de utilizador; credenciais de autenticação; histórico de acessos; preferências da conta; estado da conta; dados de recuperação de acesso.</li></ul>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3.3. Dados comerciais e de faturação</h3>
        <ul className="list-disc pl-6"><li>dados da encomenda; histórico de compras; inscrições em formações; morada de faturação; NIF; documentos contabilísticos e fiscais; informação necessária para emissão de faturas e gestão administrativa.</li></ul>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3.4. Dados de pagamento</h3>
        <ul className="list-disc pl-6"><li>identificador da transação; método de pagamento selecionado; estado do pagamento; dados de reconciliação financeira; informação comunicada por prestadores de serviços de pagamento.</li></ul>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3.5. Dados de navegação e utilização</h3>
        <ul className="list-disc pl-6"><li>endereço IP; tipo de dispositivo; sistema operativo; navegador; idioma; páginas visitadas; datas e horas de acesso; origem do tráfego; eventos e interações no website; cookies e identificadores online.</li></ul>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3.6. Dados de marketing e comunicação</h3>
        <ul className="list-disc pl-6"><li>preferências de comunicação; registos de consentimento; subscrição de newsletters; taxa de abertura, cliques e interações com campanhas; segmentação básica de comunicações.</li></ul>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3.7. Dados documentais e de projeto</h3>
        <p className="mt-2">No âmbito da plataforma de gestão documental e dos serviços de apoio a candidaturas a apoios públicos e comunitários, podem ser tratados:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>documentos carregados pelo cliente;</li>
          <li>dados de representantes legais;</li>
          <li>dados de sócios, trabalhadores, prestadores ou parceiros;</li>
          <li>informação económico-financeira, fiscal, laboral, societária e documental necessária à análise, preparação, submissão e acompanhamento de candidaturas;</li>
          <li>registos de carregamento, versão, validação e submissão.</li>
        </ul>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3.8. Dados constantes de ferramentas digitais</h3>
        <p className="mt-2">Sempre que utilizes ferramentas disponibilizadas no website, poderemos tratar os dados e ficheiros submetidos na estrita medida necessária à execução da funcionalidade pedida, à segurança da plataforma e à prevenção de utilizações abusivas.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Como recolhemos os dados</h2>
        <p>Os dados pessoais podem ser recolhidos:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>diretamente junto de ti;</li>
          <li>através de formulários preenchidos no website;</li>
          <li>no momento de criação de conta;</li>
          <li>durante a compra de formações ou outros serviços;</li>
          <li>quando interages com newsletters ou campanhas;</li>
          <li>através da navegação no website;</li>
          <li>através de cookies, pixels e tags;</li>
          <li>através de prestadores de serviços de pagamento e parceiros tecnológicos, quando necessário à execução do serviço.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Finalidades e Bases Legais do Tratamento</h2>
        <p className="mb-4">Tratamos os teus dados pessoais apenas quando exista fundamento jurídico adequado.</p>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">5.1. Gestão do website e disponibilização de funcionalidades</h3>
        <p><strong>Finalidade:</strong> assegurar o funcionamento técnico do website, autenticação, segurança, prevenção de fraude, gestão de sessão, manutenção e melhoria da experiência do utilizador.</p>
        <p><strong>Base legal:</strong> interesse legítimo e, quando aplicável, execução de contrato.</p>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">5.2. Resposta a contactos, pedidos de informação, agendamentos e propostas</h3>
        <p><strong>Finalidade:</strong> responder a pedidos submetidos através do website ou por outros meios.</p>
        <p><strong>Base legal:</strong> diligências pré-contratuais a pedido do titular e interesse legítimo na gestão do relacionamento.</p>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">5.3. Criação e gestão de conta</h3>
        <p><strong>Finalidade:</strong> permitir registo, autenticação, gestão da área reservada, recuperação de palavra-passe, consulta de compras ou serviços contratados.</p>
        <p><strong>Base legal:</strong> execução de contrato ou diligências pré-contratuais.</p>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">5.4. Venda de formações e serviços</h3>
        <p><strong>Finalidade:</strong> processar encomendas, inscrições, faturação, apoio ao cliente, disponibilização do acesso aos conteúdos ou serviços adquiridos.</p>
        <p><strong>Base legal:</strong> execução de contrato e cumprimento de obrigações legais.</p>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">5.5. Pagamentos</h3>
        <p><strong>Finalidade:</strong> processar, confirmar e reconciliar pagamentos, prevenir fraude, gerir estornos, reclamações e apoio pós-venda.</p>
        <p><strong>Base legal:</strong> execução de contrato, cumprimento de obrigações legais e interesse legítimo.</p>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">5.6. Gestão documental e candidaturas</h3>
        <p><strong>Finalidade:</strong> organizar, tratar, analisar, validar, submeter e acompanhar processos documentais e candidaturas a apoios públicos, nacionais ou comunitários.</p>
        <p><strong>Base legal:</strong> execução de contrato, diligências pré-contratuais, cumprimento de obrigações legais e, em certos casos, interesse legítimo.</p>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">5.7. Newsletter e marketing</h3>
        <p><strong>Finalidade:</strong> envio de newsletters, novidades, campanhas, conteúdos informativos, ações promocionais e comunicações relacionadas com os serviços da Clínica do Empresário.</p>
        <p><strong>Base legal:</strong> consentimento do titular, quando exigido por lei, ou interesse legítimo nas situações legalmente permitidas.</p>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">5.8. Medição, analítica e publicidade</h3>
        <p><strong>Finalidade:</strong> análise estatística, medição de desempenho, otimização de campanhas, remarketing, criação de audiências e avaliação de conversões através de tecnologias como Google tags e Meta Pixel.</p>
        <p><strong>Base legal:</strong> consentimento, sempre que legalmente exigido.</p>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">5.9. Cumprimento de obrigações legais</h3>
        <p><strong>Finalidade:</strong> faturação, contabilidade, arquivo legal, cooperação com autoridades, defesa de direitos e cumprimento de obrigações legais ou regulatórias.</p>
        <p><strong>Base legal:</strong> cumprimento de obrigação jurídica.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Newsletter e Mailchimp</h2>
        <p>A Clínica do Empresário poderá utilizar o Mailchimp para gestão de listas de contactos, envio de newsletters, campanhas automatizadas e gestão das preferências de comunicação.</p>
        <p className="mt-2">Neste contexto, podem ser tratados: nome; email; empresa; informação sobre subscrição; registos de consentimento; métricas de interação com as comunicações.</p>
        <p className="mt-2">Os dados serão tratados exclusivamente para gestão e envio de comunicações e para prova do consentimento, quando aplicável.</p>
        <p className="mt-2">Poderás retirar o teu consentimento a qualquer momento através da ligação de cancelamento incluída nas comunicações ou mediante contacto para <strong>geral@clinicadoempresario.pt</strong>.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Pagamentos e Prestadores de Serviços de Pagamento</h2>
        <p>A Clínica do Empresário poderá disponibilizar meios de pagamento eletrónico, designadamente através da Eupago e de outros operadores disponibilizados no checkout.</p>
        <p className="mt-2">No contexto de uma compra, a Clínica do Empresário trata apenas os dados estritamente necessários à confirmação da transação, associação do pagamento à encomenda, emissão de fatura, apoio ao cliente e prevenção de fraude.</p>
        <p className="mt-2">Os dados financeiros sensíveis podem ser tratados diretamente pelo prestador de pagamento, nos termos da respetiva política de privacidade e condições contratuais.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Google, Meta e Tecnologias de Rastreio</h2>
        <p>O website pode utilizar tecnologias associadas à Google e à Meta, incluindo pixels, tags e cookies, para:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>análise de tráfego;</li>
          <li>medição de conversões;</li>
          <li>atribuição de campanhas;</li>
          <li>remarketing;</li>
          <li>criação de públicos;</li>
          <li>melhoria da eficácia publicitária.</li>
        </ul>
        <p className="mt-2">Estas tecnologias apenas deverão ser ativadas nos termos definidos na Política de Cookies e de acordo com as preferências de consentimento do utilizador, sempre que legalmente exigido.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Destinatários dos Dados</h2>
        <p>Os dados pessoais poderão ser comunicados, na estrita medida do necessário, às seguintes categorias de destinatários:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>fornecedores de alojamento, manutenção e infraestrutura;</li>
          <li>plataformas de email marketing;</li>
          <li>prestadores de serviços de pagamento;</li>
          <li>fornecedores de analítica, publicidade e medição;</li>
          <li>contabilistas, advogados, auditores e consultores;</li>
          <li>autoridades públicas, regulatórias, judiciais ou fiscais, quando exigido por lei;</li>
          <li>parceiros operacionais estritamente necessários à prestação do serviço.</li>
        </ul>
        <p className="mt-4 font-semibold">Não vendemos dados pessoais a terceiros.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Transferências Internacionais de Dados</h2>
        <p>Alguns prestadores tecnológicos utilizados podem tratar dados fora do Espaço Económico Europeu. Sempre que isso aconteça, a Clínica do Empresário procurará assegurar que as transferências são feitas com base em mecanismos juridicamente adequados, incluindo decisões de adequação, cláusulas contratuais-tipo e outros mecanismos legalmente admissíveis.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Prazos de Conservação</h2>
        <p>Os dados pessoais serão conservados apenas durante o período necessário às finalidades para que foram recolhidos, sem prejuízo de prazos legais de conservação. Em termos gerais:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>dados de contacto: até ao tratamento do pedido e pelo período administrativo razoável;</li>
          <li>dados de clientes, encomendas e faturação: pelo período contratual e pelos prazos legais aplicáveis;</li>
          <li>dados de conta: enquanto a conta estiver ativa e por prazo adicional necessário à gestão de obrigações legais e defesa de direitos;</li>
          <li>dados de marketing: até retirada do consentimento ou exercício do direito de oposição;</li>
          <li>dados de candidaturas e gestão documental: pelo período necessário à prestação do serviço, arquivo contratual, auditoria e cumprimento de obrigações legais;</li>
          <li>logs de segurança: pelo período estritamente necessário à integridade e segurança dos sistemas.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Direitos dos Titulares</h2>
        <p>Tens o direito de:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>aceder aos teus dados pessoais;</li>
          <li>pedir a sua retificação;</li>
          <li>pedir o seu apagamento;</li>
          <li>solicitar a limitação do tratamento;</li>
          <li>opor-te ao tratamento;</li>
          <li>solicitar a portabilidade dos dados;</li>
          <li>retirar o consentimento, quando aplicável;</li>
          <li>não ficar sujeito a decisões exclusivamente automatizadas, nos casos legalmente previstos.</li>
        </ul>
        <p className="mt-4">Para exercer qualquer destes direitos, deves contactar: <strong>geral@clinicadoempresario.pt</strong></p>
        <p className="mt-2">Poderemos solicitar informação adicional para confirmar a tua identidade.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Reclamações</h2>
        <p>Sem prejuízo de qualquer outro meio administrativo ou judicial, tens o direito de apresentar reclamação à autoridade de controlo competente em Portugal: <strong>Comissão Nacional de Proteção de Dados (CNPD)</strong>.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Segurança</h2>
        <p>A Clínica do Empresário adota medidas técnicas e organizativas adequadas para proteger os dados pessoais contra destruição, perda, alteração, acesso não autorizado ou qualquer outra forma de tratamento ilícito.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Menores</h2>
        <p>Os serviços da Clínica do Empresário não se destinam, em regra, a menores sem intervenção ou autorização adequada dos respetivos representantes legais, quando exigível.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Ligações para Terceiros</h2>
        <p>O website pode conter hiperligações para websites ou plataformas de terceiros. A Clínica do Empresário não é responsável pelas políticas de privacidade desses websites externos.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Alterações à Política</h2>
        <p>A Clínica do Empresário reserva-se o direito de alterar a presente Política de Privacidade a qualquer momento. Quaisquer alterações materialmente relevantes serão comunicadas pelos meios adequados.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">18. Contactos</h2>
        <p>Para qualquer questão sobre esta Política de Privacidade, podes contactar:</p>
        <div className="bg-gray-50 rounded-lg p-4 mt-4">
          <p className="font-semibold">Clínica do Empresário, Unipessoal Lda</p>
          <p>Rua do Marquês 14 (StartUp Angra), Sé, 9700-117 Angra do Heroísmo</p>
          <p>Email: geral@clinicadoempresario.pt</p>
          <p>Tel.: +351 968 621 639 (Chamada para rede móvel nacional)</p>
        </div>
      </section>
    </>
  )
}

export default function PoliticaPrivacidadePage() {
  return (
    <LegalPage
      slug="politica-privacidade"
      title="Política de Privacidade"
      fallbackContent={<FallbackContent />}
    />
  )
}
