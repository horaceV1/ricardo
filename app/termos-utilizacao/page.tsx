import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Utilização e Política de Privacidade - Clínica do Empresário',
  description: 'Termos de utilização e política de privacidade da ferramenta de união de PDFs da Clínica do Empresário',
}

export default function TermosUtilizacaoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Termos de Utilização e Política de Privacidade
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-sm text-gray-500 mb-8">
            <strong>Última atualização:</strong> 17 de março de 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Natureza do Serviço</h2>
            <p>
              Esta ferramenta é disponibilizada pela Clínica do Empresário para facilitar a união de
              ficheiros PDF de forma prática. O serviço é gratuito e de uso facultativo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Privacidade e Dados</h2>
            <p>
              Garantimos a total confidencialidade dos seus documentos. O processamento dos ficheiros
              é realizado localmente no seu navegador através da biblioteca{' '}
              <span className="font-mono text-sm bg-gray-100 px-1.5 py-0.5 rounded">pdf-lib</span>.
              Nenhum ficheiro ou dado pessoal contido nos documentos é transmitido para os nossos
              servidores ou para terceiros.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Responsabilidade</h2>
            <p>
              O utilizador é o único responsável pelo conteúdo dos ficheiros que processa. A Clínica
              do Empresário não se responsabiliza por perdas de dados, corrupção de ficheiros ou
              utilização indevida da ferramenta.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Segurança Técnica</h2>
            <p>
              Recomendamos o uso de navegadores atualizados para garantir a correta execução dos
              scripts de segurança e performance.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
