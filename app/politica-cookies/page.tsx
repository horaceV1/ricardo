import { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Política de Cookies - Clínica do Empresário',
  description: 'Política de Cookies da Clínica do Empresário — como utilizamos cookies e tecnologias semelhantes.',
}

function FallbackContent() {
  return (
    <>
      <p className="text-sm text-gray-500 mb-8">
        <strong>Última atualização:</strong> 07 de abril de 2026
      </p>

      <p className="mb-8">
        A presente Política de Cookies explica o que são cookies, pixels, tags e tecnologias semelhantes, como são utilizados no website www.clinicadoempresario.pt, para que finalidades, e como podes gerir as tuas preferências.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. O que são cookies</h2>
        <p>Cookies são pequenos ficheiros de texto armazenados no teu dispositivo quando visitas um website. Permitem reconhecer o dispositivo, guardar preferências, melhorar a navegação, medir desempenho e, em certos casos, personalizar conteúdos e publicidade.</p>
        <p className="mt-2">O website pode também utilizar tecnologias semelhantes, como:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>pixels;</li>
          <li>tags;</li>
          <li>scripts;</li>
          <li>identificadores online;</li>
          <li>armazenamento local do navegador.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Para que servem os cookies</h2>
        <p>Utilizamos cookies e tecnologias semelhantes para:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>assegurar o funcionamento técnico do website;</li>
          <li>gerir sessões e autenticação;</li>
          <li>memorizar preferências do utilizador;</li>
          <li>medir tráfego e desempenho;</li>
          <li>compreender a utilização do website;</li>
          <li>melhorar a experiência do utilizador;</li>
          <li>medir resultados de campanhas;</li>
          <li>realizar remarketing e publicidade personalizada, quando autorizado.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Categorias de cookies utilizadas</h2>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3.1. Cookies estritamente necessários</h3>
        <p>São indispensáveis ao funcionamento do website e à prestação de funcionalidades básicas.</p>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3.2. Cookies de preferências</h3>
        <p>Permitem memorizar escolhas do utilizador.</p>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3.3. Cookies analíticos</h3>
        <p>Permitem recolher informação estatística sobre a utilização do website.</p>
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3.4. Cookies de marketing e publicidade</h3>
        <p>Permitem medir campanhas, criar audiências, personalizar anúncios, fazer remarketing e avaliar conversões.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Google Tags e Tecnologias Associadas</h2>
        <p>O website poderá utilizar tecnologias da Google para:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>medição de conversões;</li>
          <li>análise estatística;</li>
          <li>atribuição de campanhas;</li>
          <li>remarketing;</li>
          <li>criação de audiências;</li>
          <li>melhoria do desempenho publicitário.</li>
        </ul>
        <p className="mt-2">Sempre que legalmente exigido, estas tecnologias apenas serão ativadas após consentimento do utilizador.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Meta Pixel</h2>
        <p>O website poderá utilizar o Meta Pixel para:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>medir eventos e conversões;</li>
          <li>avaliar a eficácia de campanhas;</li>
          <li>criar públicos personalizados ou semelhantes;</li>
          <li>apoiar estratégias de remarketing e publicidade.</li>
        </ul>
        <p className="mt-2">Sempre que legalmente exigido, esta tecnologia apenas será ativada após consentimento do utilizador.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Consentimento</h2>
        <p>Quando legalmente exigido, os cookies e tecnologias não estritamente necessárias apenas serão utilizados após obtenção do teu consentimento através da plataforma de gestão de consentimento/cookies do website.</p>
        <p className="mt-2">Podes:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>aceitar todas as categorias;</li>
          <li>rejeitar as categorias não necessárias;</li>
          <li>configurar preferências por categoria;</li>
          <li>retirar o consentimento a qualquer momento.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Como gerir cookies</h2>
        <p>Podes gerir os cookies:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>através do banner ou centro de preferências do website;</li>
          <li>através das definições do teu navegador.</li>
        </ul>
        <p className="mt-2">A desativação de certos cookies pode afetar a disponibilidade ou funcionamento de algumas funcionalidades.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies de terceiros</h2>
        <p>Alguns cookies ou tecnologias semelhantes podem ser definidos por terceiros, como:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>fornecedores de analítica;</li>
          <li>plataformas de publicidade;</li>
          <li>prestadores de pagamento;</li>
          <li>plataformas de vídeos, mapas ou conteúdos incorporados;</li>
          <li>serviços de email marketing;</li>
          <li>Google;</li>
          <li>Meta.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Conservação</h2>
        <p>Os cookies podem ser:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>de sessão, sendo eliminados quando fechas o navegador; ou</li>
          <li>persistentes, permanecendo no dispositivo durante um período definido.</li>
        </ul>
        <p className="mt-2">A duração concreta de cada cookie deverá constar da tabela técnica de cookies do website.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Tabela de Cookies</h2>
        <p>A tabela abaixo deverá ser preenchida com os cookies efetivamente utilizados no website.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Atualizações</h2>
        <p>A presente Política de Cookies pode ser alterada a qualquer momento. A versão mais atual estará sempre disponível no website.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contactos</h2>
        <p>Para qualquer questão relacionada com esta Política de Cookies, podes contactar:</p>
        <div className="bg-gray-50 rounded-lg p-4 mt-4">
          <p className="font-semibold">Clínica do Empresário, Unipessoal Lda</p>
          <p>Rua do Marquês 14 (StartUp Angra), Sé, 9700-117 Angra do Heroísmo</p>
          <p>Email: geral@clinicadoempresario.pt</p>
        </div>
      </section>
    </>
  )
}

export default function PoliticaCookiesPage() {
  return (
    <LegalPage
      slug="politica-cookies"
      title="Política de Cookies"
      fallbackContent={<FallbackContent />}
    />
  )
}
