import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProduct } from '../api'
import { useCartStore } from '../store/cartStore'
import Navbar from '../components/Navbar'
import Cart from '../components/Cart'
import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

export default function ProductPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: product, isLoading } = useQuery({ queryKey: ['product', id], queryFn: () => getProduct(Number(id)) })
    const { addToCart, toggleCart } = useCartStore()
    const [quantity, setQuantity] = useState(1)

    if (isLoading) return <div className="h-screen flex items-center justify-center font-grunge text-4xl">LOADING...</div>
    if (!product) return <div>Product not found</div>

    const handleAddToCart = () => {
        addToCart({ ...product, quantity })
        toggleCart() // Open cart drawer
    }

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />
            <Cart />

            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                    {/* Image Section */}
                    <div className="flex-1">
                        <div className="aspect-[4/5] w-full max-w-xl mx-auto bg-gray-100 border border-gray-200 p-8">
                            <img src={product.image} className="w-full h-full object-contain mix-blend-multiply transition-transform hover:scale-110 duration-700" alt={product.name} />
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex-1 space-y-8">
                        <div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 uppercase tracking-widest">
                                <span onClick={() => navigate('/')} className="cursor-pointer hover:text-black">Home</span>
                                <span>/</span>
                                <span>All Products</span>
                                <span>/</span>
                                <span className="text-black">{product.name}</span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-sans uppercase font-normal mb-4 tracking-wide">{product.name}</h1>
                            <p className="text-2xl text-gray-800">R$ {product.price.toFixed(2)}</p>
                        </div>

                        {/* Quantity */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase">Quantidade</label>
                            <div className="flex border border-gray-300 w-32 h-10 items-center">
                                <button className="px-3 h-full hover:bg-gray-100 flex items-center justify-center" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={14} /></button>
                                <div className="flex-1 text-center text-sm">{quantity}</div>
                                <button className="px-3 h-full hover:bg-gray-100 flex items-center justify-center" onClick={() => setQuantity(quantity + 1)}><Plus size={14} /></button>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="bg-[#111] text-white w-full max-w-md py-4 uppercase font-bold text-sm tracking-widest hover:bg-lyoki-red transition-colors"
                        >
                            Adicionar ao Carrinho
                        </button>

                        <div className="prose prose-sm pt-8 border-t border-gray-200">
                            <h3 className="uppercase font-bold text-sm mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>

                            <h3 className="uppercase font-bold text-sm mb-2">Details</h3>
                            <ul className="text-gray-600 list-disc pl-4 space-y-1">
                                <li>Short Description: {product.shortDescription || 'N/A'}</li>
                                <li>Category: {product.category}</li>
                                <li>Stock: {product.stock} items</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
