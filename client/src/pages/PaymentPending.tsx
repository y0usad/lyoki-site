import { useNavigate, useSearchParams } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PaymentPending() {
    usePageTitle('LYOKI > PAGAMENTO PENDENTE')
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const orderId = searchParams.get('external_reference')

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans px-4">
                <div className="max-w-2xl w-full bg-white border-4 border-yellow-500 p-8 shadow-[8px_8px_0px_0px_#eab308] text-center">
                    <div className="text-6xl mb-6">⏳</div>
                    <h1 className="text-4xl font-bold mb-4 font-grunge text-yellow-600">
                        PAGAMENTO PENDENTE
                    </h1>
                    <p className="text-gray-600 mb-2 text-lg">
                        Seu pagamento está sendo processado.
                    </p>
                    {orderId && (
                        <p className="text-gray-500 mb-6">
                            Pedido: <span className="font-bold">{orderId.replace('order-', '#')}</span>
                        </p>
                    )}

                    <div className="bg-yellow-50 p-4 mb-8 text-left border-2 border-yellow-300">
                        <p className="text-sm font-semibold mb-2 text-yellow-800">ℹ️ Informações importantes:</p>
                        <ul className="text-sm text-gray-700 space-y-2">
                            <li>• <strong>Boleto:</strong> Aguardando confirmação do pagamento (até 3 dias úteis)</li>
                            <li>• <strong>PIX:</strong> Aguardando confirmação (geralmente instantâneo)</li>
                            <li>• <strong>Cartão:</strong> Em análise pela operadora</li>
                        </ul>
                    </div>

                    <p className="text-gray-600 mb-8">
                        Você receberá um email assim que o pagamento for confirmado.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate('/account')}
                            className="bg-black text-white px-8 py-4 uppercase font-bold hover:bg-yellow-600 transition-colors border-4 border-black hover:border-yellow-600"
                        >
                            Ver Meus Pedidos
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-white text-black px-8 py-4 uppercase font-bold hover:bg-black hover:text-white transition-colors border-4 border-black"
                        >
                            Voltar para Loja
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
