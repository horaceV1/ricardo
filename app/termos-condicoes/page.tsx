import { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Termos e Condições - Clínica do Empresário',
  description: 'Termos e Condições do website e loja online da Clínica do Empresário.',
}

function FallbackContent() {
  return (
    <>
      <p className="text-sm text-gray-500 mb-8">
        <strong>Última atualização:</strong> 07 de abril de 2026
      </p>

      <p className="mb-4">
        Os presentes Termos e Condições regulam o acesso e utilização do website www.clinicadoempresario.pt, da loja online, da área reservada e dos serviços digitais disponibilizados pela <strong>Clínica do Empresário, Unipessoal Lda</strong>.
      </p>
      <p className="mb-8">
        Ao navegar no website, criar conta ou adquirir qualquer produto ou serviço, o utilizador declara que leu, compreendeu e aceita os presentes Termos e Condições.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Identificação do Operador</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="font-semibold">Clínica do Empresário, Unipessoal Lda</p>
          <p>NIPC: 518715590</p>
          <p>Sede: Rua do Marquês 14 (StartUp Angra), Sé, 9700-117 Angra do Heroísmo</p>
          <p>Email: geral@clinicadoempresario.pt</p>
          <p>Telefone: +351 968 621 639 (Chamada para rede móvel nacional)</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Objeto</h2>
        <p>O website destina-se à divulgação e comercialização de:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>formações;</li>
          <li>workshops;</li>
          <li>conteúdos e serviços digitais;</li>
          <li>serviços de consultoria;</li>
          <li>ferramentas online;</li>
          <li>acesso à plataforma documental e serviços associados.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Acesso e Utilização do Website</h2>
        <p>O utilizador compromete-se a utilizar o website de forma lícita, diligente e de boa-fé.</p>
        <p className="mt-2">É proibido:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>praticar atos contrários à lei;</li>
          <li>introduzir vírus ou código malicioso;</li>
          <li>tentar aceder indevidamente a áreas reservadas;</li>
          <li>utilizar o website para fins fraudulentos ou abusivos;</li>
          <li>violar direitos de propriedade intelectual;</li>
          <li>interferir com a segurança ou estabilidade da plataforma.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Conta de Utilizador</h2>
        <p>Algumas funcionalidades exigem registo. Ao criar conta, o utilizador compromete-se a:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>fornecer dados verdadeiros, completos e atualizados;</li>
          <li>manter a confidencialidade das credenciais;</li>
          <li>não permitir a utilização da conta por terceiros não autorizados;</li>
          <li>comunicar imediatamente qualquer uso indevido ou suspeita de comprometimento da conta.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Produtos e Serviços</h2>
        <p>Os produtos, formações e serviços apresentados no website incluem descrição, preço e, quando aplicável, características específicas.</p>
        <p className="mt-2">A Clínica do Empresário reserva-se o direito de:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>alterar preços;</li>
          <li>atualizar descrições;</li>
          <li>corrigir erros manifestos;</li>
          <li>modificar ou descontinuar produtos ou serviços;</li>
          <li>recusar encomendas em caso de indisponibilidade, erro técnico ou suspeita de fraude.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Processo de Compra</h2>
        <p>A compra de formações ou serviços através da loja online compreende, em regra:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>seleção do produto ou serviço;</li>
          <li>adição ao carrinho;</li>
          <li>preenchimento dos dados necessários;</li>
          <li>escolha do método de pagamento;</li>
          <li>confirmação da encomenda;</li>
          <li>receção de confirmação por meios eletrónicos.</li>
        </ul>
        <p className="mt-2">A conclusão da encomenda depende da validação do pagamento.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Preços</h2>
        <p>Os preços apresentados são indicados em euros. Salvo indicação em contrário, os preços devem ser entendidos como incluindo o IVA à taxa legal em vigor, quando aplicável.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Pagamentos</h2>
        <p>O website poderá disponibilizar diversos meios de pagamento, designadamente:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>cartão;</li>
          <li>Multibanco;</li>
          <li>MB WAY;</li>
          <li>PayPal;</li>
          <li>outros meios indicados no checkout.</li>
        </ul>
        <p className="mt-2">Os pagamentos podem ser processados por prestadores terceiros.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Faturação</h2>
        <p>A fatura ou documento equivalente será emitida com base nos dados fornecidos pelo cliente no momento da compra. O cliente é responsável pela exatidão dos dados de faturação submetidos.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Disponibilização do Serviço</h2>
        <p>No caso das formações, workshops, conteúdos digitais ou serviços, o acesso ou execução será disponibilizado nos termos descritos na respetiva página de produto ou no contacto contratual aplicável.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Direito de Livre Resolução, Cancelamentos e Reembolsos</h2>
        <p>O regime de cancelamentos, reembolsos e direito de livre resolução encontra-se regulado em documento próprio ou em secção específica do website, devendo o cliente consultá-lo antes da compra.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Propriedade Intelectual</h2>
        <p>Todos os conteúdos do website, incluindo textos, marcas, logótipos, design, imagens, materiais formativos, vídeos, documentos, código, estrutura e organização, são propriedade da Clínica do Empresário ou de terceiros devidamente autorizados.</p>
        <p className="mt-2">É proibida a sua utilização sem autorização prévia por escrito.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Limitação de Responsabilidade</h2>
        <p>A Clínica do Empresário envida esforços razoáveis para assegurar a exatidão e atualização da informação disponibilizada, mas não garante a ausência absoluta de erros, falhas técnicas, interrupções ou indisponibilidade.</p>
        <p className="mt-2">Nada nestes Termos exclui ou limita direitos inderrogáveis do consumidor.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Links para Terceiros</h2>
        <p>O website pode conter hiperligações para plataformas ou websites de terceiros. A Clínica do Empresário não controla esses websites nem assume responsabilidade pelos seus conteúdos, disponibilidade ou políticas.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Proteção de Dados</h2>
        <p>O tratamento de dados pessoais rege-se pela <a href="/politica-privacidade" className="text-[#009999] hover:underline">Política de Privacidade</a> do website.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Cookies</h2>
        <p>A utilização de cookies e tecnologias semelhantes rege-se pela <a href="/politica-cookies" className="text-[#009999] hover:underline">Política de Cookies</a>.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Livro de Reclamações</h2>
        <p>Nos termos legais aplicáveis, encontra-se disponível acesso ao Livro de Reclamações Eletrónico.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">18. Resolução Alternativa de Litígios</h2>
        <p>Em caso de litígio de consumo, o consumidor pode recorrer a uma entidade de Resolução Alternativa de Litígios de Consumo (RAL), nos termos da legislação aplicável.</p>
        <p className="mt-2">Atendendo à localização da sede da Clínica do Empresário, o consumidor poderá recorrer, designadamente, ao:</p>
        <p className="mt-2 font-semibold">CIMARA – Centro de Informação, Mediação e Arbitragem de Consumo dos Açores</p>
        <p className="mt-2">Mais informações sobre as entidades de Resolução Alternativa de Litígios de Consumo disponíveis em Portugal podem ser consultadas no Portal do Consumidor e no portal dos Meios RAL.</p>
        <p className="mt-2">A Clínica do Empresário não se encontra vinculada por adesão prévia a uma entidade RAL específica, sem prejuízo do direito de o consumidor recorrer à entidade legalmente competente.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">19. Lei Aplicável e Foro</h2>
        <p>Os presentes Termos regem-se pela lei portuguesa. Sem prejuízo das normas imperativas de proteção do consumidor, qualquer litígio emergente da utilização do website ou dos serviços será submetido ao tribunal territorialmente competente nos termos da lei.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">20. Alterações</h2>
        <p>A Clínica do Empresário reserva-se o direito de alterar os presentes Termos a qualquer momento. A versão mais atual estará sempre disponível no website.</p>
      </section>
    </>
  )
}

export default function TermosCondicoesPage() {
  return (
    <LegalPage
      slug="termos-condicoes"
      title="Termos e Condições do Website e Loja"
      fallbackContent={<FallbackContent />}
    />
  )
}
