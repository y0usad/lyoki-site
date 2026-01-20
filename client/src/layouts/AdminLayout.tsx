import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Users, CreditCard, LogOut, Search, Settings, Home as HomeIcon } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate()
    const location = useLocation()

    const isActive = (path: string) => location.pathname === path ? 'text-white' : 'text-gray-500'

    return (
        <div className="flex min-h-screen bg-[#0a0a0a] text-gray-300 font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-800 flex flex-col p-4">
                <div className="flex items-center gap-2 mb-8 px-2">
                    <span className="font-grunge text-2xl text-white tracking-widest">LYOKI DEV</span>
                </div>

                <div className="space-y-6 flex-1">
                    <div>
                        <p className="text-xs text-gray-600 uppercase font-bold px-2 mb-2">Aplicação</p>
                        <nav className="space-y-1">
                            <button onClick={() => navigate('/admin')} className={`flex items-center gap-3 w-full p-2 hover:bg-gray-900 rounded ${isActive('/admin')}`}>
                                <LayoutDashboard size={18} /> Painel
                            </button>
                            <button onClick={() => navigate('/admin/admins')} className={`flex items-center gap-3 w-full p-2 hover:bg-gray-900 rounded ${isActive('/admin/admins')}`}>
                                <Settings size={18} /> Administradores
                            </button>
                            <button onClick={() => navigate('/')} className="flex items-center gap-3 w-full p-2 hover:bg-gray-900 rounded text-gray-500">
                                <HomeIcon size={18} /> Início (Site)
                            </button>
                            <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-900 rounded text-gray-500">
                                <Search size={18} /> Buscar
                            </button>
                        </nav>
                    </div>

                    <div>
                        <p className="text-xs text-gray-600 uppercase font-bold px-2 mb-2">Produtos</p>
                        <nav className="space-y-1">
                            <button onClick={() => navigate('/admin/products')} className={`flex items-center gap-3 w-full p-2 hover:bg-gray-900 rounded ${isActive('/admin/products')}`}>
                                <ShoppingBag size={18} /> Todos os Produtos
                            </button>
                        </nav>
                    </div>

                    <div>
                        <p className="text-xs text-gray-600 uppercase font-bold px-2 mb-2">Usuários</p>
                        <nav className="space-y-1">
                            <button onClick={() => navigate('/admin/users')} className={`flex items-center gap-3 w-full p-2 hover:bg-gray-900 rounded ${isActive('/admin/users')}`}>
                                <Users size={18} /> Todos os Usuários
                            </button>
                        </nav>
                    </div>

                    <div>
                        <p className="text-xs text-gray-600 uppercase font-bold px-2 mb-2">Pedidos / Pagamentos</p>
                        <nav className="space-y-1">
                            <button onClick={() => navigate('/admin/transactions')} className={`flex items-center gap-3 w-full p-2 hover:bg-gray-900 rounded ${isActive('/admin/transactions')}`}>
                                <CreditCard size={18} /> Todas as Transações
                            </button>
                        </nav>
                    </div>
                </div>

                <button onClick={() => {
                    localStorage.removeItem('token')
                    window.location.href = '/admin'
                }} className="flex items-center gap-3 w-full p-2 hover:bg-red-900/20 hover:text-red-500 rounded text-gray-500 mt-auto">
                    <LogOut size={18} /> Sair
                </button>
            </aside>

            {/* Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
