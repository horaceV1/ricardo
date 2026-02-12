import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Serviço - Clínica do Empresário',
  description: 'Termos e condições de uso da plataforma Clínica do Empresário',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Termos de Serviço</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-sm text-gray-500 mb-8">
            <strong>Última atualização:</strong> 4 de fevereiro de 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao aceder e utilizar a plataforma Clínica do Empresário, o utilizador declara ter lido, 
              compreendido e aceite integralmente os presentes Termos de Serviço. Se não concordar com 
              qualquer parte destes termos, não deverá utilizar os nossos serviços.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Identificação da Entidade</h2>
            <p>
              A Clínica do Empresário é uma plataforma de consultoria e formação empresarial, com sede 
              na Região Autónoma dos Açores, Portugal, sujeita à legislação portuguesa e europeia.
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Denominação:</strong> Clínica do Empresário</li>
              <li><strong>Localização:</strong> Região Autónoma dos Açores, Portugal</li>
              <li><strong>Contacto:</strong> Através do formulário disponível no website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Descrição dos Serviços</h2>
            <p>
              A Clínica do Empresário disponibiliza os seguintes serviços através da sua plataforma digital:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Cursos online de gestão e desenvolvimento empresarial</li>
              <li>Programas de consultoria empresarial</li>
              <li>Materiais educativos e recursos complementares</li>
              <li>Certificados de conclusão de formação</li>
              <li>Acesso a área de aluno personalizada</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Registo e Conta de Utilizador</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">4.1 Criação de Conta</h3>
            <p>
              Para aceder aos serviços, o utilizador deve criar uma conta fornecendo informações 
              verdadeiras, precisas e atualizadas. É da responsabilidade do utilizador manter a 
              confidencialidade das suas credenciais de acesso.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">4.2 Responsabilidade</h3>
            <p>
              O utilizador é inteiramente responsável por todas as atividades realizadas através da 
              sua conta. Qualquer utilização não autorizada deve ser imediatamente comunicada à 
              Clínica do Empresário.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">4.3 Requisitos de Idade</h3>
            <p>
              Os serviços destinam-se a indivíduos com idade igual ou superior a 18 anos. 
              Menores de idade só podem utilizar a plataforma com supervisão de um responsável legal.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Compra e Pagamento</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">5.1 Preços</h3>
            <p>
              Todos os preços apresentados incluem IVA à taxa legal em vigor em Portugal. Os preços 
              podem ser alterados sem aviso prévio, mas as alterações não afetam encomendas já confirmadas.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">5.2 Métodos de Pagamento</h3>
            <p>
              Aceitamos pagamentos através de PayPal e outros métodos indicados na plataforma. 
              Todas as transações são processadas de forma segura.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">5.3 Confirmação</h3>
            <p>
              Após a conclusão bem-sucedida do pagamento, o utilizador receberá uma confirmação por 
              email e terá acesso imediato aos conteúdos adquiridos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Direito de Retratação</h2>
            <p>
              Em conformidade com o Decreto-Lei n.º 24/2014 e a Diretiva 2011/83/UE sobre direitos 
              dos consumidores:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                O utilizador dispõe de 14 dias para exercer o direito de retratação, sem necessidade 
                de justificação
              </li>
              <li>
                O prazo inicia-se no dia seguinte à aquisição do serviço
              </li>
              <li>
                O exercício do direito de retratação implica o reembolso integral do valor pago
              </li>
              <li>
                Não é aplicável direito de retratação quando o utilizador já tenha acedido ao 
                conteúdo digital, após ter dado o seu consentimento expresso
              </li>
            </ul>
            <p className="mt-4">
              Para exercer o direito de retratação, o utilizador deve enviar comunicação inequívoca 
              através do email de contacto disponível na plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Propriedade Intelectual</h2>
            <p>
              Todos os conteúdos disponibilizados na plataforma, incluindo textos, imagens, vídeos, 
              marcas, logótipos e software, são propriedade exclusiva da Clínica do Empresário ou 
              dos seus licenciadores, estando protegidos pelas leis de propriedade intelectual.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">7.1 Licença de Uso</h3>
            <p>
              É concedida ao utilizador uma licença limitada, não exclusiva e intransferível para 
              aceder e utilizar os conteúdos adquiridos para uso pessoal e não comercial.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">7.2 Restrições</h3>
            <p>É expressamente proibido:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Copiar, reproduzir, distribuir ou modificar os conteúdos</li>
              <li>Fazer download não autorizado de materiais</li>
              <li>Partilhar credenciais de acesso com terceiros</li>
              <li>Utilizar os conteúdos para fins comerciais sem autorização</li>
              <li>Fazer engenharia reversa do software da plataforma</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Utilização Aceitável</h2>
            <p>O utilizador compromete-se a:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Utilizar a plataforma de forma legal e adequada</li>
              <li>Não praticar atos que possam prejudicar a plataforma ou outros utilizadores</li>
              <li>Não transmitir vírus, malware ou código malicioso</li>
              <li>Não tentar aceder a áreas restritas sem autorização</li>
              <li>Não fazer uso indevido dos sistemas de comunicação</li>
              <li>Respeitar os direitos de propriedade intelectual</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Garantias e Limitação de Responsabilidade</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">9.1 Garantias</h3>
            <p>
              A Clínica do Empresário compromete-se a fornecer serviços de qualidade, mas não 
              garante que a plataforma funcionará sem interrupções ou erros.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">9.2 Limitação de Responsabilidade</h3>
            <p>
              A Clínica do Empresário não será responsável por:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Danos indiretos, incidentais ou consequenciais</li>
              <li>Perda de dados ou interrupção de negócios</li>
              <li>Conteúdos ou condutas de terceiros</li>
              <li>Falhas técnicas fora do nosso controlo</li>
              <li>Vírus ou malware transmitidos através da internet</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Proteção de Dados Pessoais</h2>
            <p>
              O tratamento de dados pessoais rege-se pelo Regulamento Geral de Proteção de Dados (RGPD) 
              e pela nossa Política de Privacidade. Ao utilizar a plataforma, o utilizador consente o 
              tratamento dos seus dados pessoais conforme descrito na Política de Privacidade.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Modificações dos Termos</h2>
            <p>
              A Clínica do Empresário reserva-se o direito de modificar estes Termos de Serviço a 
              qualquer momento. As alterações entram em vigor imediatamente após a sua publicação na 
              plataforma. O utilizador será notificado de alterações significativas por email ou 
              através de aviso na plataforma.
            </p>
            <p className="mt-4">
              A utilização continuada da plataforma após a publicação de alterações constitui aceitação 
              dos novos termos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Suspensão e Cancelamento</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">12.1 Por Parte do Utilizador</h3>
            <p>
              O utilizador pode cancelar a sua conta a qualquer momento através das definições da conta 
              ou contactando o suporte. O cancelamento não dá direito a reembolso de serviços já prestados.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">12.2 Por Parte da Clínica do Empresário</h3>
            <p>
              Reservamo-nos o direito de suspender ou cancelar contas em caso de:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Violação dos presentes Termos de Serviço</li>
              <li>Atividades fraudulentas ou ilegais</li>
              <li>Utilização abusiva da plataforma</li>
              <li>Não pagamento de serviços adquiridos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Resolução de Litígios</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">13.1 Lei Aplicável</h3>
            <p>
              Estes Termos de Serviço regem-se pela lei portuguesa e europeia, nomeadamente pelo 
              Regulamento (UE) 2016/679 (RGPD) e legislação nacional aplicável.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">13.2 Resolução Alternativa de Litígios</h3>
            <p>
              Em caso de litígio, o consumidor pode recorrer a:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                <strong>Centro de Arbitragem de Conflitos de Consumo dos Açores:</strong> 
                <br />Email: geral@cacc.pt
                <br />Website: www.cacc.pt
              </li>
              <li>
                <strong>Plataforma Europeia de Resolução de Litígios Online:</strong>
                <br />https://ec.europa.eu/consumers/odr
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">13.3 Jurisdição</h3>
            <p>
              Para qualquer litígio que não possa ser resolvido amigavelmente, são competentes os 
              tribunais da Região Autónoma dos Açores.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contactos</h2>
            <p>
              Para qualquer questão relacionada com estes Termos de Serviço, o utilizador pode 
              contactar-nos através:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Do formulário de contacto disponível na plataforma</li>
              <li>Da área de suporte na conta de utilizador</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Disposições Gerais</h2>
            <p>
              Se qualquer disposição destes Termos for considerada inválida ou inexequível, as 
              restantes disposições permanecerão em pleno vigor e efeito.
            </p>
            <p className="mt-4">
              A não exigência por parte da Clínica do Empresário do cumprimento rigoroso de qualquer 
              disposição não constitui renúncia ao direito de o fazer posteriormente.
            </p>
          </section>

          <div className="border-t border-gray-200 pt-8 mt-12">
            <p className="text-sm text-gray-600">
              Ao utilizar a plataforma Clínica do Empresário, o utilizador reconhece ter lido e 
              compreendido estes Termos de Serviço e concorda em ficar vinculado pelos mesmos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
