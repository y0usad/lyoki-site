import { Shield, Lock, Eye, FileText, AlertTriangle, CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Cart from '../components/Cart'
import Footer from '../components/Footer'

export default function PoliticaLoja() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Cart />
            {/* Hero Section */}
            <div className="relative h-[300px] bg-black flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-lyoki-red/20 to-black/80 z-10"></div>
                <div className="relative z-20 text-center">
                    <h1 className="font-grunge text-6xl text-white mb-4">POLÍTICA DA LOJA</h1>
                    <div className="w-32 h-1 bg-lyoki-red mx-auto"></div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-16">
                {/* Intro */}
                <div className="text-center mb-12">
                    <p className="text-xl text-gray-700 leading-relaxed">
                        Transparência e segurança são fundamentais para nós. Leia nossa política
                        para entender como protegemos você e seus dados.
                    </p>
                </div>

                {/* Privacy Policy */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <Lock size={36} className="text-lyoki-red" />
                        <h2 className="font-grunge text-4xl">POLÍTICA DE PRIVACIDADE</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-100 p-6 border-l-4 border-lyoki-red">
                            <h3 className="font-bold text-xl mb-3">Coleta de Dados</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Coletamos apenas as informações necessárias para processar seu pedido:
                                nome, email, endereço de entrega, telefone e dados de pagamento.
                                Todos os dados são armazenados de forma segura e criptografada.
                            </p>
                        </div>

                        <div className="bg-gray-100 p-6 border-l-4 border-lyoki-red">
                            <h3 className="font-bold text-xl mb-3">Uso das Informações</h3>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                Utilizamos seus dados exclusivamente para:
                            </p>
                            <ul className="space-y-2 text-gray-700">
                                <li>✓ Processar e entregar seus pedidos</li>
                                <li>✓ Enviar atualizações sobre o status do pedido</li>
                                <li>✓ Comunicar promoções e novidades (se você optar por receber)</li>
                                <li>✓ Melhorar nossos serviços e experiência de compra</li>
                            </ul>
                        </div>

                        <div className="bg-gray-100 p-6 border-l-4 border-lyoki-red">
                            <h3 className="font-bold text-xl mb-3">Compartilhamento de Dados</h3>
                            <p className="text-gray-700 leading-relaxed">
                                <strong>Nunca</strong> vendemos, alugamos ou compartilhamos seus dados
                                pessoais com terceiros para fins de marketing. Compartilhamos informações
                                apenas com parceiros essenciais (transportadoras e processadores de pagamento)
                                para completar sua compra.
                            </p>
                        </div>

                        <div className="bg-gray-100 p-6 border-l-4 border-lyoki-red">
                            <h3 className="font-bold text-xl mb-3">Seus Direitos</h3>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem direito a:
                            </p>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Acessar seus dados pessoais</li>
                                <li>• Solicitar correção de dados incorretos</li>
                                <li>• Solicitar exclusão de seus dados</li>
                                <li>• Revogar consentimento para uso de dados</li>
                            </ul>
                            <p className="text-gray-700 mt-4">
                                Para exercer esses direitos, entre em contato: <strong>lyokisite@gmail.com</strong>
                            </p>
                        </div>
                    </div>
                </section>

                <div className="border-t-4 border-lyoki-red my-16"></div>

                {/* Security */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield size={36} className="text-lyoki-red" />
                        <h2 className="font-grunge text-4xl">SEGURANÇA</h2>
                    </div>

                    <div className="bg-black text-white p-8 border-4 border-lyoki-red mb-6">
                        <h3 className="font-grunge text-2xl mb-4 text-lyoki-red">COMPRA 100% SEGURA</h3>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Utilizamos certificado SSL e criptografia de ponta para proteger todas as
                            transações. Seus dados de pagamento são processados por plataformas
                            certificadas e nunca são armazenados em nossos servidores.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4 bg-gray-100 p-6">
                            <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
                            <div>
                                <h4 className="font-bold text-lg mb-2">Certificado SSL</h4>
                                <p className="text-gray-700">
                                    Conexão criptografada para proteger suas informações durante a navegação.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 bg-gray-100 p-6">
                            <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
                            <div>
                                <h4 className="font-bold text-lg mb-2">Pagamento Seguro</h4>
                                <p className="text-gray-700">
                                    Processamento via gateways certificados PCI-DSS.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="border-t-4 border-lyoki-red my-16"></div>

                {/* Terms of Use */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <FileText size={36} className="text-lyoki-red" />
                        <h2 className="font-grunge text-4xl">TERMOS DE USO</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-xl mb-3">1. Aceitação dos Termos</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Ao acessar e usar este site, você concorda com estes termos e condições.
                                Se não concordar, por favor, não utilize nossos serviços.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-xl mb-3">2. Propriedade Intelectual</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Todo o conteúdo deste site (textos, imagens, logos, designs) é propriedade
                                da LYOKI e está protegido por leis de direitos autorais. É proibida a
                                reprodução sem autorização prévia.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-xl mb-3">3. Uso do Site</h3>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                Você concorda em usar o site apenas para fins legais e de acordo com estas
                                condições. É proibido:
                            </p>
                            <ul className="space-y-2 text-gray-700 ml-6">
                                <li>• Usar o site de forma fraudulenta ou ilegal</li>
                                <li>• Tentar acessar áreas restritas sem autorização</li>
                                <li>• Transmitir vírus ou códigos maliciosos</li>
                                <li>• Copiar ou reproduzir conteúdo sem permissão</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-xl mb-3">4. Preços e Disponibilidade</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Todos os preços estão sujeitos a alteração sem aviso prévio. Nos reservamos
                                o direito de limitar quantidades e descontinuar produtos. Em caso de erro
                                de precificação, entraremos em contato antes de processar o pedido.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-xl mb-3">5. Limitação de Responsabilidade</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Não nos responsabilizamos por danos indiretos, incidentais ou consequenciais
                                resultantes do uso ou impossibilidade de uso do site. Nossa responsabilidade
                                máxima está limitada ao valor da compra realizada.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="border-t-4 border-lyoki-red my-16"></div>

                {/* Cookies */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <Eye size={36} className="text-lyoki-red" />
                        <h2 className="font-grunge text-4xl">POLÍTICA DE COOKIES</h2>
                    </div>

                    <div className="bg-gray-100 p-8 border-l-4 border-lyoki-red">
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Utilizamos cookies para melhorar sua experiência de navegação, lembrar suas
                            preferências e analisar o tráfego do site. Os cookies são pequenos arquivos
                            de texto armazenados no seu dispositivo.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            <strong>Tipos de cookies que usamos:</strong>
                        </p>
                        <ul className="space-y-2 text-gray-700">
                            <li>• <strong>Essenciais:</strong> Necessários para o funcionamento do site</li>
                            <li>• <strong>Funcionais:</strong> Lembram suas preferências</li>
                            <li>• <strong>Analíticos:</strong> Ajudam a entender como você usa o site</li>
                        </ul>
                        <p className="text-gray-700 mt-4">
                            Você pode desabilitar cookies nas configurações do seu navegador, mas isso
                            pode afetar a funcionalidade do site.
                        </p>
                    </div>
                </section>

                {/* Warning */}
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-16">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h4 className="font-bold text-lg mb-2 text-yellow-800">Última Atualização</h4>
                            <p className="text-yellow-700">
                                Esta política foi atualizada em Janeiro de 2026. Reservamo-nos o direito
                                de modificar estes termos a qualquer momento. Alterações significativas
                                serão comunicadas por email.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div className="text-center bg-black text-white p-12 border-4 border-lyoki-red">
                    <h2 className="font-grunge text-3xl mb-4">DÚVIDAS SOBRE NOSSA POLÍTICA?</h2>
                    <p className="text-gray-300 mb-6 text-lg">
                        Estamos à disposição para esclarecer qualquer questão.
                    </p>
                    <a
                        href="mailto:lyokisite@gmail.com"
                        className="inline-block bg-lyoki-red hover:bg-white hover:text-black text-white px-8 py-3 font-bold uppercase transition-colors border-2 border-transparent hover:border-black"
                    >
                        lyokisite@gmail.com
                    </a>
                </div>
            </div>

            <Footer />
        </div>
    )
}
