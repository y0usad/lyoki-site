import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProducts, getUsers, getTransactions } from '../../api'
import { usePageTitle } from '../../hooks/usePageTitle'
import { ShoppingBag, Users, CreditCard, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
    usePageTitle('LYOKI > DASHBOARD')

    const navigate = useNavigate()
    const { data: products } = useQuery({ queryKey: ['products'], queryFn: getProducts })
    const { data: users } = useQuery({ queryKey: ['users'], queryFn: getUsers })
    const { data: transactions } = useQuery({ queryKey: ['transactions'], queryFn: getTransactions })

    useEffect(() => {
        const token = localStorage.getItem('adminToken')
        if (!token) {
            navigate('/admin/login')
        }
    }, [navigate])

    const stats = [
        {
            title: 'Total de Produtos',
            value: products?.length || 0,
            icon: ShoppingBag,
            color: 'text-blue-500',
            bgColor: 'bg-blue-900/30'
        },
        {
            title: 'Total de Usuários',
            value: users?.length || 0,
            icon: Users,
            color: 'text-green-500',
            bgColor: 'bg-green-900/30'
        },
        {
            title: 'Total de Pedidos',
            value: transactions?.length || 0,
            icon: CreditCard,
            color: 'text-purple-500',
            bgColor: 'bg-purple-900/30'
        },
        {
            title: 'Receita Total',
            value: `R$ ${transactions?.reduce((sum: number, t: any) => sum + t.total, 0).toFixed(2) || '0.00'}`,
            icon: TrendingUp,
            color: 'text-lyoki-red',
            bgColor: 'bg-red-900/30'
        }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="bg-[#111] p-6 rounded-lg border border-gray-800">
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Bem-vindo ao painel administrativo LYOKI</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <div key={index} className="bg-[#111] p-6 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
                                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                    <Icon size={20} className={stat.color} />
                                </div>
                            </div>
                            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    )
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
                <h2 className="text-xl font-bold text-white mb-4">Ações Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="bg-[#0a0a0a] hover:bg-gray-900 border border-gray-800 hover:border-gray-700 text-white p-4 rounded-lg transition-colors text-left"
                    >
                        <ShoppingBag size={24} className="text-blue-500 mb-2" />
                        <h3 className="font-bold mb-1">Gerenciar Produtos</h3>
                        <p className="text-sm text-gray-400">Adicionar, editar ou remover produtos</p>
                    </button>

                    <button
                        onClick={() => navigate('/admin/users')}
                        className="bg-[#0a0a0a] hover:bg-gray-900 border border-gray-800 hover:border-gray-700 text-white p-4 rounded-lg transition-colors text-left"
                    >
                        <Users size={24} className="text-green-500 mb-2" />
                        <h3 className="font-bold mb-1">Gerenciar Usuários</h3>
                        <p className="text-sm text-gray-400">Visualizar e editar usuários</p>
                    </button>

                    <button
                        onClick={() => navigate('/admin/transactions')}
                        className="bg-[#0a0a0a] hover:bg-gray-900 border border-gray-800 hover:border-gray-700 text-white p-4 rounded-lg transition-colors text-left"
                    >
                        <CreditCard size={24} className="text-purple-500 mb-2" />
                        <h3 className="font-bold mb-1">Ver Transações</h3>
                        <p className="text-sm text-gray-400">Acompanhar pedidos e pagamentos</p>
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
                <h2 className="text-xl font-bold text-white mb-4">Atividade Recente</h2>
                <div className="space-y-3">
                    {transactions && transactions.length > 0 ? (
                        transactions.slice(0, 5).map((transaction: any) => (
                            <div key={transaction.id} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded border border-gray-800">
                                <div>
                                    <p className="text-white font-medium">Pedido #{transaction.id}</p>
                                    <p className="text-sm text-gray-400">{transaction.customerName || 'Cliente'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-green-500 font-bold">R$ {transaction.total.toFixed(2)}</p>
                                    <p className="text-xs text-gray-500">{new Date(transaction.createdAt).toLocaleDateString('pt-BR')}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-8">Nenhuma transação recente</p>
                    )}
                </div>
            </div>
        </div>
    )
}
