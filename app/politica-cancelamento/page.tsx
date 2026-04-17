import { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Política de Cancelamento, Reembolso e Livre Resolução - Clínica do Empresário',
  description: 'Política de Cancelamento, Reembolso e Livre Resolução da Clínica do Empresário.',
}

function FallbackContent() {
  return (
    <>
      <p className="text-sm text-gray-500 mb-8">
        <strong>Última atualização:</strong> 07 de abril de 2026
      </p>

      <p className="mb-8">
        A presente Política regula as condições de cancelamento, reembolso e exercício do direito de livre resolução aplicáveis às compras efetuadas através do website www.clinicadoempresario.pt.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Âmbito</h2>
        <p>Esta Política aplica-se à aquisição de:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>formações;</li>
          <li>workshops;</li>
          <li>serviços digitais;</li>
          <li>conteúdos digitais;</li>
          <li>consultoria;</li>
          <li>outros serviços disponibilizados através do website.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Direito de Livre Resolução</h2>
        <p><strong>Quando aplicável nos termos legais, o consumidor dispõe de um prazo de 14 dias para resolver o contrato sem necessidade de indicar motivo.</strong></p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Forma de Exercício</h2>
        <p>Para exercer o direito de livre resolução, o consumidor deverá comunicar de forma inequívoca a sua decisão, através de:</p>
        <ul className="list-disc pl-6 mt-2">
          <li><strong>email para geral@clinicadoempresario.pt;</strong> ou</li>
          <li>outro meio escrito disponibilizado pela Clínica do Empresário.</li>
        </ul>
        <p className="mt-4">A comunicação deverá identificar, pelo menos:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>nome do cliente;</li>
          <li>número da encomenda;</li>
          <li>serviço ou produto adquirido;</li>
          <li>data da compra;</li>
          <li>declaração clara de resolução.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Reembolso</h2>
        <p>Em caso de resolução válida, a Clínica do Empresário reembolsará os montantes recebidos, nos termos e prazos legalmente aplicáveis.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Exceções e Limitações</h2>
        <p>Nos casos legalmente previstos, o direito de livre resolução poderá não ser aplicável ou poderá extinguir-se após o início da execução do serviço.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Formações Presenciais</h2>
        <p>No caso de formações presenciais, o cancelamento pelo cliente poderá obedecer às condições específicas indicadas na página de cada formação ou proposta comercial.</p>
        <p className="mt-2">Na ausência de condições específicas:</p>
        <ul className="list-disc pl-6 mt-2">
          <li><strong>até 14 dias antes da data agendada:</strong> reembolso de 100%;</li>
          <li><strong>entre 13 e 5 dias:</strong> reembolso de 50%;</li>
          <li>após esse prazo ou em caso de não comparência: sem reembolso, salvo disposição legal aplicável.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Formações Online em Direto</h2>
        <p>No caso de formações online em direto, o cancelamento e reembolso poderão depender:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>da antecedência do pedido;</li>
          <li>do envio de materiais;</li>
          <li>da reserva de vaga;</li>
          <li>do início efetivo da execução do serviço.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Conteúdos Digitais e Formações com Acesso Imediato</h2>
        <p>Quando a compra implique acesso imediato a conteúdos digitais, área reservada, materiais descarregáveis, gravações, módulos ou outros conteúdos online, o cliente poderá ser chamado a prestar consentimento expresso para o início da execução antes do termo do prazo de livre resolução.</p>
        <p className="mt-2">Nesses casos, e quando legalmente aplicável, o início do acesso poderá implicar a perda do direito de livre resolução.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cancelamento ou Alteração pela Clínica do Empresário</h2>
        <p>A Clínica do Empresário reserva-se o direito de adiar, reprogramar ou cancelar uma formação ou serviço por motivo justificado.</p>
        <p className="mt-2">Nesses casos, o cliente terá direito, conforme o caso:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>à remarcação;</li>
          <li>à emissão de crédito;</li>
          <li>ao reembolso do montante pago.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Pedidos de Apoio</h2>
        <p>Qualquer questão sobre cancelamentos ou reembolsos deverá ser dirigida para:</p>
        <p className="mt-2 font-semibold">geral@clinicadoempresario.pt</p>
      </section>
    </>
  )
}

export default function PoliticaCancelamentoPage() {
  return (
    <LegalPage
      slug="politica-cancelamento"
      title="Política de Cancelamento, Reembolso e Livre Resolução"
      fallbackContent={<FallbackContent />}
    />
  )
}
