import { CreditCard, Smartphone, Banknote, Shield, Clock, CheckCircle, Lock } from 'lucide-react'
import Navbar from '../components/Navbar'
import Cart from '../components/Cart'
import Footer from '../components/Footer'

export default function MetodosPagamento() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Cart />
            {/* Hero Section */}
            <div className="relative h-[300px] bg-black flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-lyoki-red/20 to-black/80 z-10"></div>
                <div className="relative z-20 text-center">
                    <h1 className="font-grunge text-6xl text-white mb-4">MÉTODOS DE PAGAMENTO</h1>
                    <div className="w-32 h-1 bg-lyoki-red mx-auto"></div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-16">
                {/* Intro */}
                <div className="text-center mb-12">
                    <p className="text-xl text-gray-700 leading-relaxed">
                        Oferecemos diversas formas de pagamento para sua comodidade e segurança.
                    </p>
                </div>

                {/* Payment Methods Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {/* PIX */}
                    <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 border-4 border-black shadow-[8px_8px_0px_0px_#000] transform hover:scale-105 transition-transform">
                        <div className="flex justify-center mb-6">
                            <div className="bg-teal-600 p-4 rounded-full">
                                <Smartphone size={48} className="text-white" />
                            </div>
                        </div>
                        <h3 className="font-grunge text-3xl text-center mb-4">PIX</h3>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start gap-2">
                                <CheckCircle size={20} className="text-teal-600 flex-shrink-0 mt-0.5" />
                                <span>Aprovação instantânea</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle size={20} className="text-teal-600 flex-shrink-0 mt-0.5" />
                                <span>Desconto de 5%</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle size={20} className="text-teal-600 flex-shrink-0 mt-0.5" />
                                <span>Disponível 24/7</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle size={20} className="text-teal-600 flex-shrink-0 mt-0.5" />
                                <span>Seguro e rápido</span>
                            </li>
                        </ul>
                    </div>

                    {/* Credit Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 border-4 border-black shadow-[8px_8px_0px_0px_#000] transform hover:scale-105 transition-transform">
                        <div className="flex justify-center mb-6">
                            <div className="bg-blue-600 p-4 rounded-full">
                                <CreditCard size={48} className="text-white" />
                            </div>
                        </div>
                        <h3 className="font-grunge text-3xl text-center mb-4">CARTÃO</h3>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start gap-2">
                                <CheckCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                <span>Até 12x sem juros</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                <span>Visa, Master, Elo</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                <span>Crédito e Débito</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                <span>100% seguro</span>
                            </li>
                        </ul>
                    </div>

                    {/* Cash */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 border-4 border-black shadow-[8px_8px_0px_0px_#000] transform hover:scale-105 transition-transform">
                        <div className="flex justify-center mb-6">
                            <div className="bg-green-600 p-4 rounded-full">
                                <Banknote size={48} className="text-white" />
                            </div>
                        </div>
                        <h3 className="font-grunge text-3xl text-center mb-4">DINHEIRO</h3>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start gap-2">
                                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                                <span>Apenas retirada na loja</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                                <span>Desconto de 5%</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                                <span>Sem taxas</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                                <span>Pagamento na hora</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Payment Icons */}
                <div className="bg-gray-100 p-12 border-t-4 border-lyoki-red mb-16">
                    <h2 className="font-grunge text-3xl text-center mb-8">ACEITAMOS</h2>
                    <div className="flex flex-wrap justify-center items-center gap-8">
                        {/* PIX Icon */}
                        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-300 hover:border-lyoki-red transition-colors">
                            <div className="text-center">
                                <div className="text-teal-600 font-bold text-4xl mb-2">PIX</div>
                                <p className="text-xs text-gray-600">Pagamento Instantâneo</p>
                            </div>
                        </div>

                        {/* Visa */}
                        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-300 hover:border-lyoki-red transition-colors">
                            <div className="text-center">
                                <div className="text-blue-800 font-bold text-4xl mb-2">VISA</div>
                                <p className="text-xs text-gray-600">Crédito e Débito</p>
                            </div>
                        </div>

                        {/* Mastercard */}
                        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-300 hover:border-lyoki-red transition-colors">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-red-600"></div>
                                    <div className="w-8 h-8 rounded-full bg-orange-500 -ml-4"></div>
                                </div>
                                <div className="font-bold text-sm">Mastercard</div>
                                <p className="text-xs text-gray-600">Crédito e Débito</p>
                            </div>
                        </div>

                        {/* Elo */}
                        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-300 hover:border-lyoki-red transition-colors">
                            <div className="text-center">
                                <div className="text-yellow-600 font-bold text-4xl mb-2">ELO</div>
                                <p className="text-xs text-gray-600">Crédito e Débito</p>
                            </div>
                        </div>

                        {/* Cash */}
                        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-300 hover:border-lyoki-red transition-colors">
                            <div className="text-center">
                                <div className="text-green-600 text-4xl mb-2">💵</div>
                                <div className="font-bold text-sm">Dinheiro</div>
                                <p className="text-xs text-gray-600">Retirada na Loja</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How it Works */}
                <section className="mb-16">
                    <h2 className="font-grunge text-4xl text-center mb-12">COMO FUNCIONA</h2>

                    <div className="space-y-8">
                        {/* PIX Process */}
                        <div className="bg-teal-50 p-8 border-l-4 border-teal-600">
                            <h3 className="font-bold text-2xl mb-4 flex items-center gap-3">
                                <Smartphone className="text-teal-600" size={32} />
                                Pagamento via PIX
                            </h3>
                            <ol className="space-y-3 text-gray-700">
                                <li className="flex items-start gap-3">
                                    <span className="bg-teal-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
                                    <span>Finalize seu pedido e escolha PIX como forma de pagamento</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-teal-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                                    <span>Copie o código PIX ou escaneie o QR Code</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-teal-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                                    <span>Abra o app do seu banco e realize o pagamento</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-teal-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">4</span>
                                    <span>Pronto! Seu pedido será confirmado automaticamente</span>
                                </li>
                            </ol>
                        </div>

                        {/* Card Process */}
                        <div className="bg-blue-50 p-8 border-l-4 border-blue-600">
                            <h3 className="font-bold text-2xl mb-4 flex items-center gap-3">
                                <CreditCard className="text-blue-600" size={32} />
                                Pagamento via Cartão
                            </h3>
                            <ol className="space-y-3 text-gray-700">
                                <li className="flex items-start gap-3">
                                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
                                    <span>Escolha cartão de crédito ou débito no checkout</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                                    <span>Preencha os dados do cartão de forma segura</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                                    <span>Escolha o número de parcelas (até 12x sem juros)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">4</span>
                                    <span>Aguarde a aprovação (geralmente instantânea)</span>
                                </li>
                            </ol>
                        </div>
                    </div>
                </section>

                {/* Security */}
                <div className="bg-black text-white p-12 border-4 border-lyoki-red mb-16">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <Shield size={48} className="text-lyoki-red" />
                        <h2 className="font-grunge text-4xl">SEGURANÇA GARANTIDA</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div>
                            <Lock className="mx-auto mb-3 text-lyoki-red" size={32} />
                            <h4 className="font-bold mb-2">Criptografia SSL</h4>
                            <p className="text-gray-300 text-sm">
                                Seus dados são protegidos por criptografia de ponta
                            </p>
                        </div>
                        <div>
                            <Clock className="mx-auto mb-3 text-lyoki-red" size={32} />
                            <h4 className="font-bold mb-2">Aprovação Rápida</h4>
                            <p className="text-gray-300 text-sm">
                                Processamento instantâneo ou em poucos minutos
                            </p>
                        </div>
                        <div>
                            <Shield className="mx-auto mb-3 text-lyoki-red" size={32} />
                            <h4 className="font-bold mb-2">Ambiente Seguro</h4>
                            <p className="text-gray-300 text-sm">
                                Plataforma certificada e monitorada 24/7
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="bg-gray-100 p-8 border-t-4 border-lyoki-red">
                    <h2 className="font-grunge text-3xl mb-6">DÚVIDAS FREQUENTES</h2>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-bold text-lg mb-2">Meu pagamento foi recusado. O que fazer?</h4>
                            <p className="text-gray-700">
                                Entre em contato com seu banco para verificar o motivo. Problemas comuns incluem
                                limite insuficiente, dados incorretos ou bloqueio de segurança.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-2">Posso parcelar no PIX?</h4>
                            <p className="text-gray-700">
                                Não. O PIX é um pagamento à vista. Para parcelamento, utilize cartão de crédito.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-2">Quanto tempo leva para aprovar o pagamento?</h4>
                            <p className="text-gray-700">
                                PIX: Instantâneo | Cartão de Crédito: Até 2 horas | Débito: Instantâneo
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
