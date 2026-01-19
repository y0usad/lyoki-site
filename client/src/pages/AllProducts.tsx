import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../api'
import Navbar from '../components/Navbar'
import Cart from '../components/Cart'

export default function AllProducts() {
    const { data: products, isLoading } = useQuery({ queryKey: ['products'], queryFn: getProducts })

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-lyoki-red selection:text-white">
            <Navbar />
            <Cart />

            <div className="max-w-[1600px] mx-auto px-4 py-32">
                <h1 className="font-grunge text-6xl text-center mb-20 text-black">ALL PRODUCTS</h1>

                {isLoading ? (
                    <div className="text-center py-20 font-grunge text-4xl animate-pulse">LOADING CHAOS...</div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20">
                        {products?.map((product: any) => (
                            <div key={product.id} className="group relative cursor-pointer" onClick={() => window.location.href = `/product/${product.id}`}>
                                <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative mb-6 border border-transparent hover:border-black transition-all">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0 contrast-125"
                                    />
                                    {/* Stock Badge */}
                                    {product.stock < 10 && (
                                        <div className="absolute top-2 left-2 bg-lyoki-red text-white text-[10px] uppercase font-bold px-2 py-1">
                                            Last Units
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-center font-bold text-sm md:text-base uppercase tracking-wider font-sans">{product.name}</h3>
                                <p className="text-center text-gray-500 font-bold text-sm mt-2">R$ {product.price.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
