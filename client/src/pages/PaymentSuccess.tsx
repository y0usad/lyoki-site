import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PaymentSuccess() {
    usePageTitle('LYOKI > PAGAMENTO APROVADO')
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const paymentId = searchParams.get('payment_id')
    const orderId = searchParams.get('external_reference')

    useEffect(() => {
        // Opcional: Verificar status do pagamento no backend
        console.log('Payment ID:', paymentId)
        console.log('Order ID:', orderId)
    }, [paymentId, orderId])

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans px-4">
                <div className="max-w-2xl w-full bg-white border-4 border-green-600 p-8 shadow-[8px_8px_0px_0px_#22c55e] text-center">
                    <div className="text-6xl mb-6">✅</div>
                    <h1 className="text-4xl font-bold mb-4 font-grunge text-green-600">
                        PAGAMENTO APROVADO!
                    </h1>
                    <p className="text-gray-600 mb-2 text-lg">
                        Seu pedido foi confirmado com sucesso!
                    </p>
                    {orderId && (
                        <p className="text-gray-500 mb-6">
                            Número do pedido: <span className="font-bold">{orderId.replace('order-', '#')}</span>
                        </p>
                    )}
                    <p className="text-gray-600 mb-8">
                        Você receberá um email de confirmação em breve.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate('/account')}
                            className="bg-black text-white px-8 py-4 uppercase font-bold hover:bg-green-600 transition-colors border-4 border-black hover:border-green-600"
                        >
                            Ver Meus Pedidos
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-white text-black px-8 py-4 uppercase font-bold hover:bg-black hover:text-white transition-colors border-4 border-black"
                        >
                            Continuar Comprando
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
