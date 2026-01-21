import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { usePageTitle } from '../hooks/usePageTitle'
import Navbar from '../components/Navbar'
import Cart from '../components/Cart'
import Footer from '../components/Footer'
import { Trash2, Plus, Minus, Tag, FileText } from 'lucide-react'

export default function CartPage() {
    usePageTitle('LYOKI > CARRINHO')
    const { cart, total, removeFromCart, updateQuantity } = useCartStore()
    const navigate = useNavigate()

    const handleQuantityChange = (id: number, newQuantity: number) => {
        if (newQuantity < 1) return
        updateQuantity(id, newQuantity)
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <Cart />
                <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans px-4">
                    <h1 className="text-4xl font-bold mb-6 font-grunge text-center">SEU CARRINHO ESTÁ VAZIO</h1>
                    <p className="text-gray-600 mb-8 text-lg text-center">Adicione produtos para continuar</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-black text-white px-12 py-4 uppercase font-bold hover:bg-lyoki-red transition-colors border-4 border-black hover:border-lyoki-red shadow-[8px_8px_0px_0px_#DC143C]"
                    >
                        Ir para Loja
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
                    <h1 className="font-grunge text-6xl mb-2">MEU CARRINHO</h1>
                    <p className="text-gray-400 text-lg">{cart.length} {cart.length === 1 ? 'item' : 'itens'} no carrinho</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#DC143C]">
                            <h2 className="font-grunge text-3xl mb-6">PRODUTOS</h2>

                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-4 items-center bg-gray-50 p-4 border-2 border-black">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-24 h-32 object-cover border-2 border-gray-300"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg uppercase mb-1">{item.name}</h3>
                                            <p className="text-gray-600 text-sm mb-3">R$ {item.price.toFixed(2)}</p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="w-12 text-center font-bold">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price & Remove */}
                                        <div className="flex flex-col items-end gap-3">
                                            <p className="font-bold text-xl">R$ {(item.price * item.quantity).toFixed(2)}</p>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-lyoki-red hover:text-black transition-colors"
                                                title="Remover item"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Promo Code & Notes */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <button className="flex items-center gap-2 justify-center border-2 border-black p-4 hover:bg-black hover:text-white transition-colors">
                                <Tag size={20} />
                                <span className="font-semibold uppercase text-sm">Insira o código promocional</span>
                            </button>
                            <button className="flex items-center gap-2 justify-center border-2 border-black p-4 hover:bg-black hover:text-white transition-colors">
                                <FileText size={20} />
                                <span className="font-semibold uppercase text-sm">Adicione uma observação</span>
                            </button>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 border-4 border-black p-6 shadow-[8px_8px_0px_0px_#DC143C] sticky top-24">
                            <h2 className="font-grunge text-3xl mb-6">RESUMO DO PEDIDO</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-base">
                                    <span className="text-gray-600 font-semibold">Subtotal</span>
                                    <span className="font-bold">R$ {total().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="text-gray-600 font-semibold">Entrega</span>
                                    <span className="font-bold text-green-600">GRÁTIS</span>
                                </div>

                                {/* Shipping Location */}
                                <div className="pt-4 border-t-2 border-gray-300">
                                    <p className="text-sm text-gray-600 mb-2">São Paulo, Brasil</p>
                                    <select className="w-full border-2 border-black p-2 text-sm">
                                        <option>PAC 2 - R$ 0,00</option>
                                        <option>SEDEX - R$ 24,80</option>
                                    </select>
                                </div>

                                <div className="flex justify-between text-3xl font-bold pt-4 border-t-2 border-gray-300">
                                    <span className="font-grunge">TOTAL</span>
                                    <span className="text-lyoki-red">R$ {total().toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Checkout Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full bg-lyoki-red text-white py-4 font-bold uppercase text-lg hover:bg-black transition-colors border-4 border-lyoki-red hover:border-black"
                                >
                                    Checkout
                                </button>

                                <button className="w-full bg-yellow-400 text-black py-4 font-bold uppercase text-sm hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2">
                                    <span className="text-blue-700 font-bold">Pay</span>
                                    <span className="text-blue-500 font-bold">Pal</span>
                                    <span>Checkout</span>
                                </button>

                                <div className="text-center pt-2">
                                    <p className="text-xs text-gray-600 flex items-center justify-center gap-1">
                                        🔒 <span className="uppercase font-semibold">Checkout seguro</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
