import { Menu, X, Instagram, MessageCircle, Music, User } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
    const { toggleCart, cart } = useCartStore()
    const { isAuthenticated } = useAuthStore()
    const count = cart.reduce((acc, item) => acc + item.quantity, 0)
    const [menuOpen, setMenuOpen] = useState(false)

    const toggleMenu = () => setMenuOpen(!menuOpen)

    return (
        <>
            <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-black py-4 px-6 flex justify-between items-center uppercase tracking-widest text-xs md:text-sm font-bold">
                <div className="flex items-center gap-4">
                    <a href="/" className="font-grunge text-2xl tracking-normal text-black no-underline">LYOKI</a>
                </div>

                <div className="flex items-center gap-6">
                    <a
                        href={isAuthenticated ? "/account" : "/login"}
                        className="flex items-center gap-1 hover:text-lyoki-red transition-colors"
                        title={isAuthenticated ? "Minha Conta" : "Login"}
                    >
                        <User className="w-4 h-4" />
                        <span className="hidden md:inline">{isAuthenticated ? "Conta" : "Login"}</span>
                    </a>
                    <button className="flex items-center gap-1 hover:text-lyoki-red transition-colors" onClick={toggleCart}>
                        Carrinho <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded-full">{count}</span>
                    </button>
                    <button onClick={toggleMenu} className="hover:text-lyoki-red transition-colors">
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Sidebar */}
            {menuOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/50 z-[60] animate-in fade-in duration-300"
                        onClick={toggleMenu}
                    ></div>

                    {/* Sidebar */}
                    <div className="fixed top-0 right-0 h-full w-80 bg-[#1a1a1a] z-[70] shadow-2xl animate-in slide-in-from-right duration-300">
                        {/* Close Button */}
                        <button
                            onClick={toggleMenu}
                            className="absolute top-6 right-6 text-white hover:text-lyoki-red transition-colors"
                        >
                            <X size={28} />
                        </button>

                        {/* Menu Content */}
                        <div className="flex flex-col h-full pt-20 pb-8 px-8">
                            {/* Navigation Links */}
                            <nav className="flex-1 space-y-6">
                                <a
                                    href="/"
                                    className="block text-white hover:text-lyoki-red transition-colors text-lg font-light tracking-wider"
                                    onClick={toggleMenu}
                                >
                                    Página Inicial
                                </a>
                                <a
                                    href="/products"
                                    className="block text-white hover:text-lyoki-red transition-colors text-lg font-light tracking-wider"
                                    onClick={toggleMenu}
                                >
                                    Loja
                                </a>
                                <a
                                    href="/quem-somos"
                                    className="block text-white hover:text-lyoki-red transition-colors text-lg font-light tracking-wider"
                                    onClick={toggleMenu}
                                >
                                    Quem Somos
                                </a>
                                <a
                                    href="/contato"
                                    className="block text-white hover:text-lyoki-red transition-colors text-lg font-light tracking-wider"
                                    onClick={toggleMenu}
                                >
                                    Contato
                                </a>

                                <div className="border-t border-gray-700 pt-6 mt-6">
                                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">Suporte</p>
                                    <a
                                        href="/faq"
                                        className="block text-white hover:text-lyoki-red transition-colors text-lg font-light tracking-wider mb-4"
                                        onClick={toggleMenu}
                                    >
                                        FAQ
                                    </a>
                                    <a
                                        href="/envio-devolucoes"
                                        className="block text-white hover:text-lyoki-red transition-colors text-lg font-light tracking-wider mb-4"
                                        onClick={toggleMenu}
                                    >
                                        Envio e Devoluções
                                    </a>
                                    <a
                                        href="/politica-loja"
                                        className="block text-white hover:text-lyoki-red transition-colors text-lg font-light tracking-wider mb-4"
                                        onClick={toggleMenu}
                                    >
                                        Política da Loja
                                    </a>
                                    <a
                                        href="/metodos-pagamento"
                                        className="block text-white hover:text-lyoki-red transition-colors text-lg font-light tracking-wider"
                                        onClick={toggleMenu}
                                    >
                                        Métodos de Pagamento
                                    </a>
                                </div>
                            </nav>

                            {/* Social Media Icons */}
                            <div className="border-t border-gray-700 pt-6">
                                <div className="flex justify-center gap-6">
                                    <a
                                        href="https://www.instagram.com/lyoki_____/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-lyoki-red transition-colors"
                                    >
                                        <Instagram size={24} />
                                    </a>
                                    <a
                                        href="https://wa.me/5511999999999"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-lyoki-red transition-colors"
                                    >
                                        <MessageCircle size={24} />
                                    </a>
                                    <a
                                        href="https://tiktok.com/@lyoki"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-lyoki-red transition-colors"
                                    >
                                        <Music size={24} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
