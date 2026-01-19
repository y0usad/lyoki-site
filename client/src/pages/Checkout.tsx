import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { createOrder } from '../api'
import Navbar from '../components/Navbar'
import Cart from '../components/Cart'
import Footer from '../components/Footer'

export default function Checkout() {
    const { cart, total, clearCart } = useCartStore()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        address: '',
        city: '',
        postalCode: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await createOrder({
                items: cart.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price })),
                total: total(),
                customerName: formData.name,
                customerEmail: formData.email,
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode
            })
            alert('✅ Pedido realizado com sucesso!')
            clearCart()
            navigate('/')
        } catch (e) {
            alert('❌ Erro ao processar pedido. Tente novamente.')
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <Cart />
                <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans">
                    <h1 className="text-4xl font-bold mb-6 font-grunge text-center">SEU CARRINHO ESTÁ VAZIO</h1>
                    <p className="text-gray-600 mb-8 text-lg">Adicione produtos para continuar</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-black text-white px-12 py-4 uppercase font-bold hover:bg-lyoki-red transition-colors border-4 border-black hover:border-lyoki-red shadow-[8px_8px_0px_0px_#DC143C]"
                    >
                        Voltar para Loja
                    </button>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Cart />

            {/* Hero Section */}
            <div className="bg-black text-white py-12 border-b-4 border-lyoki-red">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="font-grunge text-6xl mb-2">CHECKOUT</h1>
                    <p className="text-gray-400 text-lg">Finalize seu pedido</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Form */}
                    <div className="order-2 lg:order-1">
                        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#DC143C]">
                            <h2 className="font-grunge text-3xl mb-8 text-black">DADOS DO PEDIDO</h2>

                            <form onSubmit={handlePayment} className="space-y-8">
                                {/* Contact Info */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-lg uppercase border-b-2 border-black pb-2 flex items-center gap-2">
                                        <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                        Informações de Contato
                                    </h3>
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full border-2 border-black p-4 outline-none focus:border-lyoki-red transition-colors text-lg"
                                        placeholder="seu@email.com"
                                        type="email"
                                        required
                                    />
                                </div>

                                {/* Shipping Address */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-lg uppercase border-b-2 border-black pb-2 flex items-center gap-2">
                                        <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                        Endereço de Entrega
                                    </h3>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full border-2 border-black p-4 outline-none focus:border-lyoki-red transition-colors text-lg"
                                        placeholder="Nome Completo"
                                        required
                                    />
                                    <input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full border-2 border-black p-4 outline-none focus:border-lyoki-red transition-colors text-lg"
                                        placeholder="Endereço Completo (Rua, Número, Complemento)"
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full border-2 border-black p-4 outline-none focus:border-lyoki-red transition-colors text-lg"
                                            placeholder="Cidade"
                                            required
                                        />
                                        <input
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            className="w-full border-2 border-black p-4 outline-none focus:border-lyoki-red transition-colors text-lg"
                                            placeholder="CEP"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-lyoki-red text-white py-5 font-bold uppercase text-xl tracking-widest hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-4 border-lyoki-red hover:border-black shadow-[8px_8px_0px_0px_#000]"
                                >
                                    {loading ? 'PROCESSANDO...' : `FINALIZAR PEDIDO - R$ ${total().toFixed(2)}`}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="order-1 lg:order-2">
                        <div className="bg-gray-50 border-4 border-black p-8 shadow-[8px_8px_0px_0px_#DC143C] sticky top-24">
                            <h2 className="font-grunge text-3xl mb-6 text-black">RESUMO DO PEDIDO</h2>

                            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-4 items-center bg-white p-4 border-2 border-black">
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={item.image}
                                                className="w-20 h-24 object-cover border-2 border-gray-300"
                                                alt={item.name}
                                            />
                                            <span className="absolute -top-2 -right-2 bg-lyoki-red text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold border-2 border-black">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold uppercase text-sm truncate">{item.name}</h3>
                                            <p className="text-gray-500 text-xs mt-1">Quantidade: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-lg flex-shrink-0">R$ {(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="border-t-4 border-black pt-6 space-y-4 bg-white p-6">
                                <div className="flex justify-between text-base">
                                    <span className="text-gray-600 font-semibold">Subtotal</span>
                                    <span className="font-bold">R$ {total().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="text-gray-600 font-semibold">Frete</span>
                                    <span className="font-bold text-green-600">GRÁTIS</span>
                                </div>
                                <div className="flex justify-between text-3xl font-bold pt-4 border-t-2 border-gray-300">
                                    <span className="font-grunge">TOTAL</span>
                                    <span className="text-lyoki-red">R$ {total().toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Security Badge */}
                            <div className="mt-6 bg-black text-white p-4 text-center">
                                <p className="text-xs uppercase tracking-wider">🔒 Compra 100% Segura</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
