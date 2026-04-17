import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Condições de Utilização da Plataforma de Gestão Documental - Clínica do Empresário',
  description: 'Condições de utilização da plataforma de gestão documental da Clínica do Empresário.',
}

export default function CondicoesPlataformaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Condições de Utilização da Plataforma de Gestão Documental
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-sm text-gray-500 mb-8">
            <strong>Última atualização:</strong> 07 de abril de 2026
          </p>

          <p className="mb-8">
            As presentes Condições regulam o acesso e utilização da plataforma de gestão documental disponibilizada pela <strong>Clínica do Empresário, Unipessoal Lda</strong> no contexto dos seus serviços de consultoria, organização documental, preparação, submissão e acompanhamento de candidaturas a apoios públicos, nacionais e comunitários.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Objeto</h2>
            <p>A plataforma destina-se à recolha, organização, carregamento, partilha controlada, validação e acompanhamento de documentos e informação necessária à prestação dos serviços contratados.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Acesso à Plataforma</h2>
            <p>O acesso poderá depender de:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>criação de conta;</li>
              <li>atribuição de credenciais;</li>
              <li>convite do cliente ou da Clínica do Empresário;</li>
              <li>verificação de identidade;</li>
              <li>aceitação das presentes Condições.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Utilização Permitida</h2>
            <p>A plataforma só poderá ser utilizada para fins legítimos e relacionados com os serviços contratados.</p>
            <p className="mt-2">É proibido:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>carregar conteúdos ilícitos;</li>
              <li>carregar malware ou ficheiros prejudiciais;</li>
              <li>utilizar a plataforma para finalidades não autorizadas;</li>
              <li>aceder ou tentar aceder a informação de terceiros sem autorização;</li>
              <li>contornar controlos de acesso ou segurança.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Responsabilidade pelos Documentos Carregados</h2>
            <p>O utilizador ou cliente que carregue documentos na plataforma declara e garante que:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>tem legitimidade para o fazer;</li>
              <li>os dados pessoais incluídos são necessários e proporcionais;</li>
              <li>informou os titulares dos dados, quando legalmente exigido;</li>
              <li>dispõe do fundamento jurídico adequado para a comunicação desses dados;</li>
              <li>os documentos não violam direitos de terceiros nem disposições legais.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Natureza dos Dados Tratados</h2>
            <p>A plataforma pode envolver o tratamento de:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>dados de identificação;</li>
              <li>dados profissionais;</li>
              <li>dados societários;</li>
              <li>dados fiscais;</li>
              <li>dados laborais;</li>
              <li>dados financeiros;</li>
              <li>documentos de suporte a candidaturas e projetos;</li>
              <li>outros dados estritamente necessários à finalidade contratual.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Perfis de Acesso e Permissões</h2>
            <p>A Clínica do Empresário poderá definir perfis de acesso diferenciados, com base no princípio da necessidade de conhecimento.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Tratamento de Dados Pessoais</h2>
            <p>O tratamento de dados pessoais no contexto da plataforma rege-se pela <a href="/politica-privacidade" className="text-[#009999] hover:underline">Política de Privacidade</a> e, quando aplicável, por acordo específico de tratamento de dados celebrado entre a Clínica do Empresário e o cliente.</p>
            <p className="mt-2">Consoante o caso, a Clínica do Empresário poderá atuar:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>como responsável pelo tratamento; ou</li>
              <li>como subcontratante, por conta do cliente.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Segurança</h2>
            <p>A Clínica do Empresário adotará medidas técnicas e organizativas adequadas à proteção da plataforma e dos dados nela tratados.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Conservação e Eliminação</h2>
            <p>Os documentos e dados serão conservados pelo período necessário à prestação do serviço, ao cumprimento de obrigações legais, à defesa de direitos e às necessidades de arquivo contratualmente previstas.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Confidencialidade</h2>
            <p>A Clínica do Empresário compromete-se a tratar com confidencialidade a informação e documentação a que tenha acesso, sem prejuízo das comunicações necessárias:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>à execução do serviço;</li>
              <li>ao cumprimento de obrigação legal;</li>
              <li>ao exercício ou defesa de direitos.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Suspensão e Encerramento</h2>
            <p>A Clínica do Empresário poderá suspender ou encerrar o acesso à plataforma, total ou parcialmente, em caso de:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>violação das presentes Condições;</li>
              <li>utilização abusiva;</li>
              <li>risco de segurança;</li>
              <li>incumprimento contratual;</li>
              <li>determinação legal ou regulatória;</li>
              <li>manutenção técnica ou evolução do serviço.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Limitação de Responsabilidade</h2>
            <p>Na medida permitida por lei, a Clínica do Empresário não será responsável por:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>falhas imputáveis ao utilizador;</li>
              <li>carregamento de documentos incorretos, incompletos ou ilegítimos;</li>
              <li>indisponibilidade temporária da plataforma;</li>
              <li>prejuízos indiretos ou consequenciais;</li>
              <li>atos ou omissões de terceiros fora do seu controlo razoável.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Propriedade Intelectual</h2>
            <p>A plataforma, o seu design, estrutura, software, documentação e funcionalidades são protegidos por direitos de propriedade intelectual.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Alterações</h2>
            <p>A Clínica do Empresário reserva-se o direito de alterar as presentes Condições. A versão mais recente estará sempre disponível pelos meios adequados.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Lei Aplicável</h2>
            <p>As presentes Condições regem-se pela lei portuguesa.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
