import { Link } from 'react-router-dom'
import { Instagram, MessageCircle, Music } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-black text-white border-t-4 border-lyoki-red">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* SOCIAL */}
                    <div>
                        <h3 className="font-grunge text-xl mb-4 text-lyoki-red">SOCIAL</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>
                                <Link to="/quem-somos" className="hover:text-lyoki-red transition-colors uppercase text-sm">
                                    Quem Somos
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://www.instagram.com/lyoki_____/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-lyoki-red transition-colors uppercase text-sm flex items-center gap-2"
                                >
                                    <Instagram size={16} />
                                    Instagram
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://wa.me/5511999999999"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-lyoki-red transition-colors uppercase text-sm flex items-center gap-2"
                                >
                                    <MessageCircle size={16} />
                                    WhatsApp
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://tiktok.com/@lyoki"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-lyoki-red transition-colors uppercase text-sm flex items-center gap-2"
                                >
                                    <Music size={16} />
                                    TikTok
                                </a>
                            </li>
                            <li>
                                <Link to="/contato" className="hover:text-lyoki-red transition-colors uppercase text-sm">
                                    Contato
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* SUPORTE */}
                    <div>
                        <h3 className="font-grunge text-xl mb-4 text-lyoki-red">SUPORTE</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>
                                <Link to="/faq" className="hover:text-lyoki-red transition-colors uppercase text-sm">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/envio-devolucoes" className="hover:text-lyoki-red transition-colors uppercase text-sm">
                                    Envio e Devoluções
                                </Link>
                            </li>
                            <li>
                                <Link to="/politica-loja" className="hover:text-lyoki-red transition-colors uppercase text-sm">
                                    Política da Loja
                                </Link>
                            </li>
                            <li>
                                <Link to="/metodos-pagamento" className="hover:text-lyoki-red transition-colors uppercase text-sm">
                                    Métodos de Pagamento
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* NEWSLETTER */}
                    <div>
                        <h3 className="font-grunge text-xl mb-4 text-lyoki-red">ACOMPANHE AS NOVIDADES</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Receba updates sobre novos drops e exclusividades
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Inscreva seu email aqui"
                                className="flex-1 bg-white/10 border border-gray-700 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-lyoki-red outline-none"
                            />
                            <button className="bg-lyoki-red hover:bg-white hover:text-black text-white px-6 py-2 font-bold uppercase text-sm transition-colors border-2 border-transparent hover:border-black">
                                Participar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                    <p>© 2026 LYOKI. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
