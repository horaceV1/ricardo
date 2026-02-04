import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade - Clínica do Empresário',
  description: 'Política de privacidade e proteção de dados pessoais da Clínica do Empresário',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Política de Privacidade</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-sm text-gray-500 mb-8">
            <strong>Última atualização:</strong> 4 de fevereiro de 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introdução</h2>
            <p>
              A Clínica do Empresário compromete-se a proteger a privacidade e os dados pessoais dos 
              seus utilizadores. Esta Política de Privacidade descreve como recolhemos, utilizamos, 
              armazenamos e protegemos as informações pessoais, em conformidade com o Regulamento 
              Geral de Proteção de Dados (RGPD - Regulamento (UE) 2016/679) e a legislação portuguesa 
              aplicável, incluindo a Lei n.º 58/2019.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Responsável pelo Tratamento</h2>
            <p>
              O responsável pelo tratamento dos dados pessoais é:
            </p>
            <ul className="list-none pl-0 mt-4 space-y-2">
              <li><strong>Denominação:</strong> Clínica do Empresário</li>
              <li><strong>Localização:</strong> Região Autónoma dos Açores, Portugal</li>
              <li><strong>Contacto:</strong> Através do formulário disponível no website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Dados Pessoais Recolhidos</h2>
            <p>
              Podemos recolher e processar as seguintes categorias de dados pessoais:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">3.1 Dados de Registo e Identificação</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nome completo (primeiro e último nome)</li>
              <li>Endereço de email</li>
              <li>Nome de utilizador</li>
              <li>Palavra-passe (armazenada de forma encriptada)</li>
              <li>Data de registo</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">3.2 Dados de Contacto</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Número de telefone</li>
              <li>Morada completa (rua, cidade, código postal, país)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">3.3 Dados de Pagamento</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Informações de faturação</li>
              <li>Histórico de transações</li>
              <li>Método de pagamento utilizado (processado por terceiros como PayPal)</li>
            </ul>
            <p className="mt-2 text-sm italic">
              Nota: Não armazenamos informações completas de cartões de crédito. O processamento de 
              pagamentos é realizado por processadores de pagamento certificados (PCI-DSS).
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">3.4 Dados de Utilização</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Endereço IP</li>
              <li>Tipo de navegador e versão</li>
              <li>Sistema operativo</li>
              <li>Páginas visitadas e tempo de visita</li>
              <li>Referências de navegação (páginas de origem)</li>
              <li>Progresso nos cursos</li>
              <li>Histórico de atividades na plataforma</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">3.5 Cookies e Tecnologias Similares</h3>
            <p>
              Utilizamos cookies e tecnologias similares para melhorar a experiência do utilizador. 
              Para mais informações, consulte a nossa Política de Cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Finalidades do Tratamento de Dados</h2>
            <p>
              Os dados pessoais são recolhidos e tratados para as seguintes finalidades:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">4.1 Execução de Contrato</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Criação e gestão da conta de utilizador</li>
              <li>Fornecimento de acesso aos cursos e conteúdos adquiridos</li>
              <li>Processamento de pagamentos</li>
              <li>Emissão de certificados de conclusão</li>
              <li>Comunicação sobre os serviços contratados</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">4.2 Cumprimento de Obrigações Legais</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cumprimento de obrigações fiscais e contabilísticas</li>
              <li>Resposta a pedidos de autoridades competentes</li>
              <li>Prevenção de fraude e atividades ilegais</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">4.3 Interesses Legítimos</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Melhoria dos serviços e da experiência do utilizador</li>
              <li>Análise estatística e estudos de mercado</li>
              <li>Segurança da plataforma e prevenção de abusos</li>
              <li>Gestão de reclamações e suporte ao cliente</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">4.4 Consentimento (quando aplicável)</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Envio de newsletters e comunicações de marketing</li>
              <li>Personalização de conteúdos e recomendações</li>
              <li>Utilização de cookies não essenciais</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Base Legal do Tratamento</h2>
            <p>
              O tratamento de dados pessoais tem como base legal:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                <strong>Execução de contrato:</strong> Artigo 6.º, n.º 1, alínea b) do RGPD - 
                Para a prestação dos serviços solicitados
              </li>
              <li>
                <strong>Obrigação legal:</strong> Artigo 6.º, n.º 1, alínea c) do RGPD - 
                Para cumprimento de obrigações legais
              </li>
              <li>
                <strong>Interesses legítimos:</strong> Artigo 6.º, n.º 1, alínea f) do RGPD - 
                Para melhoria dos serviços e segurança
              </li>
              <li>
                <strong>Consentimento:</strong> Artigo 6.º, n.º 1, alínea a) do RGPD - 
                Para comunicações de marketing e cookies não essenciais
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Partilha de Dados com Terceiros</h2>
            <p>
              Os dados pessoais podem ser partilhados com as seguintes categorias de destinatários:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">6.1 Prestadores de Serviços</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Processadores de pagamento:</strong> PayPal (com sede nos EUA, certificado 
                Privacy Shield/adequação)
              </li>
              <li>
                <strong>Serviços de hosting:</strong> Hostinger e Vercel (infraestrutura cloud)
              </li>
              <li>
                <strong>Serviços de email:</strong> Para envio de comunicações transacionais
              </li>
              <li>
                <strong>Ferramentas de análise:</strong> Para estatísticas de utilização (anonimizadas)
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">6.2 Autoridades Competentes</h3>
            <p>
              Quando exigido por lei ou ordem judicial, podemos partilhar dados com:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Autoridades fiscais e financeiras</li>
              <li>Forças de segurança</li>
              <li>Tribunais e autoridades reguladoras</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">6.3 Garantias</h3>
            <p>
              Todos os prestadores de serviços estão contratualmente obrigados a:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Tratar os dados apenas para as finalidades autorizadas</li>
              <li>Implementar medidas de segurança adequadas</li>
              <li>Cumprir o RGPD e legislação aplicável</li>
              <li>Não transferir dados para terceiros sem autorização</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Transferências Internacionais</h2>
            <p>
              Alguns dos nossos prestadores de serviços podem estar localizados fora do Espaço 
              Económico Europeu (EEE). Nestes casos, asseguramos que:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                O país de destino possui uma decisão de adequação da Comissão Europeia; ou
              </li>
              <li>
                São implementadas garantias adequadas, como Cláusulas Contratuais Tipo aprovadas 
                pela Comissão Europeia; ou
              </li>
              <li>
                O prestador de serviços está certificado sob um mecanismo de transferência reconhecido
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Período de Conservação dos Dados</h2>
            <p>
              Os dados pessoais são conservados apenas pelo período necessário para as finalidades 
              para as quais foram recolhidos:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">8.1 Dados de Conta Ativa</h3>
            <p>
              Enquanto a conta estiver ativa e durante o período de acesso aos conteúdos adquiridos.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">8.2 Dados Financeiros e Fiscais</h3>
            <p>
              Mínimo de 10 anos após a transação, conforme exigido pela legislação fiscal portuguesa 
              (Código do IRC e legislação complementar).
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">8.3 Dados de Marketing</h3>
            <p>
              Até que o utilizador retire o consentimento ou se oponha ao tratamento.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">8.4 Conta Inativa</h3>
            <p>
              Após 3 anos de inatividade, a conta pode ser eliminada, salvo obrigação legal de conservação.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Direitos dos Titulares dos Dados</h2>
            <p>
              Nos termos do RGPD, o utilizador tem os seguintes direitos:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">9.1 Direito de Acesso (Artigo 15.º)</h3>
            <p>
              Obter confirmação sobre se os seus dados pessoais estão a ser tratados e, se for o 
              caso, aceder aos mesmos.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">9.2 Direito de Retificação (Artigo 16.º)</h3>
            <p>
              Solicitar a correção de dados pessoais inexatos ou a completar dados incompletos.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">9.3 Direito ao Apagamento (Artigo 17.º)</h3>
            <p>
              Solicitar o apagamento dos dados pessoais quando:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Já não forem necessários para as finalidades</li>
              <li>Retirar o consentimento e não existir outra base legal</li>
              <li>Se opuser ao tratamento e não existirem interesses legítimos prevalecentes</li>
              <li>Os dados tenham sido tratados ilicitamente</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">9.4 Direito à Limitação do Tratamento (Artigo 18.º)</h3>
            <p>
              Solicitar a limitação do tratamento quando:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contestar a exatidão dos dados</li>
              <li>O tratamento for ilícito mas se opuser ao apagamento</li>
              <li>Necessitar dos dados para ação judicial</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">9.5 Direito à Portabilidade (Artigo 20.º)</h3>
            <p>
              Receber os dados pessoais num formato estruturado, de uso corrente e de leitura 
              automática, e transmitir esses dados a outro responsável.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">9.6 Direito de Oposição (Artigo 21.º)</h3>
            <p>
              Opor-se ao tratamento dos dados pessoais, incluindo para efeitos de marketing direto.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">9.7 Direito a Não Ficar Sujeito a Decisões Automatizadas (Artigo 22.º)</h3>
            <p>
              Não ficar sujeito a decisões baseadas unicamente no tratamento automatizado que 
              produzam efeitos na sua esfera jurídica.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">9.8 Direito de Retirar o Consentimento</h3>
            <p>
              Retirar o consentimento a qualquer momento, sem comprometer a licitude do tratamento 
              efetuado com base no consentimento previamente dado.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
              <p className="font-semibold text-blue-900">Como Exercer os Seus Direitos:</p>
              <p className="text-blue-800 mt-2">
                Para exercer qualquer destes direitos, o utilizador deve enviar um pedido através:
              </p>
              <ul className="list-disc pl-6 mt-2 text-blue-800 space-y-1">
                <li>Do formulário de contacto disponível na plataforma</li>
                <li>Das definições da conta de utilizador</li>
                <li>Por email para o contacto indicado</li>
              </ul>
              <p className="text-blue-800 mt-2">
                Responderemos no prazo de 1 mês (podendo ser prorrogado por mais 2 meses em casos complexos).
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Medidas de Segurança</h2>
            <p>
              Implementamos medidas técnicas e organizativas adequadas para proteger os dados 
              pessoais contra destruição, perda, alteração, divulgação ou acesso não autorizados:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">10.1 Medidas Técnicas</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encriptação de dados em trânsito (HTTPS/TLS)</li>
              <li>Encriptação de palavras-passe (hashing)</li>
              <li>Firewalls e sistemas de deteção de intrusões</li>
              <li>Backups regulares e seguros</li>
              <li>Autenticação segura e gestão de sessões</li>
              <li>Monitorização de segurança contínua</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">10.2 Medidas Organizativas</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Políticas de segurança da informação</li>
              <li>Controlo de acessos baseado em funções</li>
              <li>Formação em proteção de dados</li>
              <li>Acordos de confidencialidade com colaboradores</li>
              <li>Procedimentos de resposta a incidentes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Violações de Dados Pessoais</h2>
            <p>
              Em caso de violação de dados pessoais que possa resultar num risco para os direitos e 
              liberdades dos titulares:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                Notificaremos a Comissão Nacional de Proteção de Dados (CNPD) no prazo de 72 horas
              </li>
              <li>
                Comunicaremos aos titulares afetados quando o risco for elevado
              </li>
              <li>
                Tomaremos medidas imediatas para mitigar os danos
              </li>
              <li>
                Documentaremos o incidente conforme exigido pelo RGPD
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Menores de Idade</h2>
            <p>
              Os nossos serviços não se destinam a menores de 18 anos. Não recolhemos intencionalmente 
              dados de menores sem o consentimento dos pais ou tutores legais.
            </p>
            <p className="mt-4">
              Se tomarmos conhecimento de que recolhemos dados de um menor sem consentimento adequado, 
              tomaremos medidas para eliminar esses dados o mais rapidamente possível.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Cookies</h2>
            <p>
              Utilizamos cookies e tecnologias similares para:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Cookies essenciais: Necessários para o funcionamento da plataforma</li>
              <li>Cookies de desempenho: Para análise e melhoria dos serviços</li>
              <li>Cookies de funcionalidade: Para personalização da experiência</li>
              <li>Cookies de marketing: Para publicidade direcionada (apenas com consentimento)</li>
            </ul>
            <p className="mt-4">
              O utilizador pode gerir as suas preferências de cookies através das definições do 
              navegador ou do banner de cookies na plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Alterações à Política de Privacidade</h2>
            <p>
              Reservamo-nos o direito de atualizar esta Política de Privacidade periodicamente para 
              refletir alterações nas nossas práticas ou na legislação aplicável.
            </p>
            <p className="mt-4">
              Alterações significativas serão comunicadas através de:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Notificação por email</li>
              <li>Aviso destacado na plataforma</li>
              <li>Atualização da data "Última atualização" no topo desta página</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Direito de Apresentar Reclamação</h2>
            <p>
              O utilizador tem o direito de apresentar reclamação junto da autoridade de controlo 
              competente:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-4">
              <p className="font-semibold text-gray-900 mb-3">
                Comissão Nacional de Proteção de Dados (CNPD)
              </p>
              <ul className="list-none space-y-2 text-sm">
                <li><strong>Morada:</strong> Av. D. Carlos I, 134, 1º, 1200-651 Lisboa, Portugal</li>
                <li><strong>Telefone:</strong> +351 213 928 400</li>
                <li><strong>Email:</strong> geral@cnpd.pt</li>
                <li><strong>Website:</strong> www.cnpd.pt</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Contactos</h2>
            <p>
              Para questões relacionadas com esta Política de Privacidade ou para exercer os seus 
              direitos, contacte-nos através:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Do formulário de contacto na plataforma</li>
              <li>Da área de suporte da sua conta</li>
              <li>Do email de contacto indicado no website</li>
            </ul>
          </section>

          <div className="border-t border-gray-200 pt-8 mt-12">
            <p className="text-sm text-gray-600">
              Esta Política de Privacidade está em conformidade com o Regulamento (UE) 2016/679 
              (RGPD), a Lei n.º 58/2019, e demais legislação portuguesa e europeia aplicável em 
              matéria de proteção de dados pessoais.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
