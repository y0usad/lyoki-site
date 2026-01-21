import { Package, Truck, RefreshCw, Clock, MapPin, AlertCircle } from 'lucide-react'
import { useEffect } from 'react'
import { usePageTitle } from '../hooks/usePageTitle'
import Navbar from '../components/Navbar'
import Cart from '../components/Cart'
import Footer from '../components/Footer'

export default function EnvioDevolucoes() {
    usePageTitle('ENVIO E DEVOLUÇÕES')

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Cart />
            {/* Hero Section */}
            <div className="relative h-[300px] bg-black flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-lyoki-red/20 to-black/80 z-10"></div>
                <div className="relative z-20 text-center">
                    <h1 className="font-grunge text-6xl text-white mb-4">ENVIO E DEVOLUÇÕES</h1>
                    <div className="w-32 h-1 bg-lyoki-red mx-auto"></div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-16">
                {/* Shipping Section */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <Truck size={40} className="text-lyoki-red" />
                        <h2 className="font-grunge text-4xl">POLÍTICA DE ENVIO</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gray-100 p-6 border-l-4 border-lyoki-red">
                            <div className="flex items-center gap-3 mb-3">
                                <Clock className="text-lyoki-red" size={24} />
                                <h3 className="font-bold text-xl">Prazo de Processamento</h3>
                            </div>
                            <p className="text-gray-700">
                                Todos os pedidos são processados em até <strong>2 dias úteis</strong> após
                                a confirmação do pagamento. Você receberá um email de confirmação assim
                                que seu pedido for enviado.
                            </p>
                        </div>

                        <div className="bg-gray-100 p-6 border-l-4 border-lyoki-red">
                            <div className="flex items-center gap-3 mb-3">
                                <MapPin className="text-lyoki-red" size={24} />
                                <h3 className="font-bold text-xl">Prazo de Entrega</h3>
                            </div>
                            <ul className="text-gray-700 space-y-2">
                                <li>• <strong>Região Sul:</strong> 5 a 10 dias úteis</li>
                                <li>• <strong>Região Sudeste:</strong> 7 a 12 dias úteis</li>
                                <li>• <strong>Demais Regiões:</strong> 10 a 15 dias úteis</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-black text-white p-8 border-4 border-lyoki-red">
                        <h3 className="font-grunge text-2xl mb-4">FRETE GRÁTIS</h3>
                        <p className="text-gray-300 text-lg">
                            🎉 Aproveite <strong className="text-lyoki-red">FRETE GRÁTIS</strong> para
                            compras acima de <strong className="text-lyoki-red">R$ 299,00</strong> para
                            todo o Brasil!
                        </p>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="flex items-start gap-4">
                            <Package className="text-lyoki-red flex-shrink-0 mt-1" size={24} />
                            <div>
                                <h4 className="font-bold text-lg mb-2">Rastreamento</h4>
                                <p className="text-gray-700">
                                    Após o envio, você receberá o código de rastreamento por email.
                                    Acompanhe sua encomenda em tempo real através do site dos Correios
                                    ou da transportadora.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <AlertCircle className="text-lyoki-red flex-shrink-0 mt-1" size={24} />
                            <div>
                                <h4 className="font-bold text-lg mb-2">Importante</h4>
                                <p className="text-gray-700">
                                    Os prazos de entrega começam a contar a partir da confirmação do
                                    pagamento e postagem do produto. Não nos responsabilizamos por
                                    atrasos causados pelos Correios ou transportadoras.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="border-t-4 border-lyoki-red my-16"></div>

                {/* Returns Section */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <RefreshCw size={40} className="text-lyoki-red" />
                        <h2 className="font-grunge text-4xl">POLÍTICA DE DEVOLUÇÕES E TROCAS</h2>
                    </div>

                    <div className="bg-gray-100 p-8 border-l-4 border-lyoki-red mb-8">
                        <h3 className="font-bold text-2xl mb-4">Você tem 7 dias para trocar ou devolver</h3>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            Conforme o Código de Defesa do Consumidor, você tem até <strong>7 dias
                                corridos</strong> após o recebimento do produto para solicitar troca ou
                            devolução, sem necessidade de justificativa.
                        </p>
                    </div>

                    <div className="space-y-6 mb-8">
                        <div>
                            <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                                <span className="bg-lyoki-red text-white w-8 h-8 rounded-full flex items-center justify-center">1</span>
                                Condições para Troca/Devolução
                            </h3>
                            <ul className="ml-10 space-y-2 text-gray-700">
                                <li>✓ Produto sem uso, lavagem ou alterações</li>
                                <li>✓ Etiquetas originais intactas</li>
                                <li>✓ Embalagem original preservada</li>
                                <li>✓ Nota fiscal ou comprovante de compra</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                                <span className="bg-lyoki-red text-white w-8 h-8 rounded-full flex items-center justify-center">2</span>
                                Como Solicitar
                            </h3>
                            <ol className="ml-10 space-y-2 text-gray-700">
                                <li>1. Entre em contato através do email <strong>lyokisite@gmail.com</strong></li>
                                <li>2. Informe o número do pedido e o motivo da troca/devolução</li>
                                <li>3. Aguarde nossas instruções para envio</li>
                                <li>4. Envie o produto conforme orientações</li>
                            </ol>
                        </div>

                        <div>
                            <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                                <span className="bg-lyoki-red text-white w-8 h-8 rounded-full flex items-center justify-center">3</span>
                                Processamento
                            </h3>
                            <p className="ml-10 text-gray-700">
                                Após recebermos o produto e confirmarmos que está em perfeitas condições,
                                processaremos sua troca ou reembolso em até <strong>10 dias úteis</strong>.
                                O reembolso será feito na mesma forma de pagamento utilizada na compra.
                            </p>
                        </div>
                    </div>

                    <div className="bg-black text-white p-8 border-4 border-lyoki-red">
                        <h3 className="font-grunge text-2xl mb-4 text-lyoki-red">CUSTO DE DEVOLUÇÃO</h3>
                        <div className="space-y-3 text-gray-300">
                            <p>
                                <strong className="text-white">Defeito de fabricação:</strong> Frete de devolução por nossa conta
                            </p>
                            <p>
                                <strong className="text-white">Arrependimento/Troca de tamanho:</strong> Frete de devolução por conta do cliente
                            </p>
                            <p>
                                <strong className="text-white">Produto errado enviado:</strong> Frete de devolução e reenvio por nossa conta
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
                            <div>
                                <h4 className="font-bold text-lg mb-2 text-yellow-800">Produtos Não Trocáveis</h4>
                                <p className="text-yellow-700">
                                    Por questões de higiene e segurança, não aceitamos devolução de produtos
                                    íntimos (cuecas, calcinhas, meias) após abertura da embalagem, exceto em
                                    caso de defeito de fabricação.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact CTA */}
                <div className="mt-16 text-center bg-gray-100 p-12 border-t-4 border-lyoki-red">
                    <h2 className="font-grunge text-3xl mb-4">DÚVIDAS SOBRE ENVIO OU DEVOLUÇÃO?</h2>
                    <p className="text-gray-700 mb-6 text-lg">
                        Nossa equipe está pronta para ajudar você!
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="/contato"
                            className="bg-black hover:bg-lyoki-red text-white px-8 py-3 font-bold uppercase transition-colors"
                        >
                            Falar com Suporte
                        </a>
                        <a
                            href="/faq"
                            className="bg-lyoki-red hover:bg-black text-white px-8 py-3 font-bold uppercase transition-colors"
                        >
                            Ver FAQ
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
