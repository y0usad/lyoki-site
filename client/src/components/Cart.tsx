import { X, Minus, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'

export default function Cart() {
    const { cart, isOpen, toggleCart, removeFromCart, addToCart, total } = useCartStore()

    const navigate = useNavigate()

    const handleCheckout = () => {
        if (cart.length === 0) return
        toggleCart() // Close the drawer
        navigate('/checkout')
    }

    const handleViewCart = () => {
        toggleCart() // Close the drawer
        navigate('/cart')
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleCart} />
            <div className="relative w-full max-w-md bg-white h-full border-l-2 border-black flex flex-col p-6 animate-in slide-in-from-right duration-300 shadow-2xl">
                <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
                    <h2 className="font-grunge text-3xl">MEU CARRINHO</h2>
                    <button onClick={toggleCart} className="hover:text-lyoki-red transition-colors"><X /></button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6">
                    {cart.length === 0 && <p className="text-gray-500 uppercase text-sm text-center py-8">Seu carrinho está vazio</p>}
                    {cart.map(item => (
                        <div key={item.id} className="flex gap-4 bg-gray-50 p-3 border border-gray-200">
                            <img src={item.image} alt={item.name} className="w-20 h-24 object-cover border border-gray-300" />
                            <div className="flex-1 space-y-1">
                                <h3 className="font-bold text-sm uppercase">{item.name}</h3>
                                <p className="text-sm font-semibold">R$ {item.price.toFixed(2)}</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <button className="p-1 hover:bg-gray-200 border border-gray-300" onClick={() => removeFromCart(item.id)}><Minus size={14} /></button>
                                    <span className="text-sm font-bold w-8 text-center">{item.quantity}</span>
                                    <button className="p-1 hover:bg-gray-200 border border-gray-300" onClick={() => addToCart(item)}><Plus size={14} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 border-t-2 border-black pt-4 space-y-3">
                    <div className="flex justify-between font-bold text-xl">
                        <span>TOTAL</span>
                        <span className="text-lyoki-red">R$ {total().toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleViewCart}
                        disabled={cart.length === 0}
                        className="w-full bg-white text-black border-2 border-black py-3 uppercase font-bold tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Ver Carrinho
                    </button>
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="w-full bg-black text-white py-4 uppercase font-bold tracking-widest hover:bg-lyoki-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        Finalizar Compra
                    </button>
                </div>
            </div>
        </div>
    )
}
