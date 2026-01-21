import { useNavigate, useSearchParams } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PaymentFailure() {
    usePageTitle('LYOKI > PAGAMENTO RECUSADO')
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const orderId = searchParams.get('external_reference')

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans px-4">
                <div className="max-w-2xl w-full bg-white border-4 border-red-600 p-8 shadow-[8px_8px_0px_0px_#DC143C] text-center">
                    <div className="text-6xl mb-6">❌</div>
                    <h1 className="text-4xl font-bold mb-4 font-grunge text-red-600">
                        PAGAMENTO RECUSADO
                    </h1>
                    <p className="text-gray-600 mb-6 text-lg">
                        Não foi possível processar seu pagamento.
                    </p>
                    {orderId && (
                        <p className="text-gray-500 mb-6">
                            Pedido: <span className="font-bold">{orderId.replace('order-', '#')}</span>
                        </p>
                    )}

                    <div className="bg-gray-50 p-4 mb-8 text-left border-2 border-gray-300">
                        <p className="text-sm font-semibold mb-2">Possíveis motivos:</p>
                        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                            <li>Saldo insuficiente</li>
                            <li>Dados do cartão incorretos</li>
                            <li>Limite de crédito excedido</li>
                            <li>Cartão bloqueado ou vencido</li>
                        </ul>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate('/checkout')}
                            className="bg-black text-white px-8 py-4 uppercase font-bold hover:bg-lyoki-red transition-colors border-4 border-black hover:border-lyoki-red"
                        >
                            Tentar Novamente
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
