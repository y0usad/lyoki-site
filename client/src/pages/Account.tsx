import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { User, Mail, MapPin, Package, Edit2, LogOut } from 'lucide-react'

export default function Account() {
    const navigate = useNavigate()
    const { user, orders, isAuthenticated, logout, updateUser } = useAuthStore()
    const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile')
    const [isEditing, setIsEditing] = useState(false)

    const [formData, setFormData] = useState({
        name: user?.name || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        cpf: user?.cpf || '',
        street: user?.address?.street || '',
        number: user?.address?.number || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        zipCode: user?.address?.zipCode || '',
        country: user?.address?.country || 'Brasil'
    })

    if (!isAuthenticated || !user) {
        navigate('/login')
        return null
    }

    const handleSave = () => {
        updateUser({
            name: formData.name,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            cpf: formData.cpf,
            address: {
                street: formData.street,
                number: formData.number,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                country: formData.country
            }
        })
        setIsEditing(false)
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'text-green-600 bg-green-50'
            case 'shipped': return 'text-blue-600 bg-blue-50'
            case 'processing': return 'text-yellow-600 bg-yellow-50'
            case 'cancelled': return 'text-red-600 bg-red-50'
            default: return 'text-gray-600 bg-gray-50'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'delivered': return 'Entregue'
            case 'shipped': return 'Enviado'
            case 'processing': return 'Processando'
            case 'cancelled': return 'Cancelado'
            default: return 'Pendente'
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-black text-white py-12 border-b-4 border-lyoki-red">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-grunge text-6xl mb-2">MINHA CONTA</h1>
                            <p className="text-gray-400 text-lg">Olá, {user.name}!</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-lyoki-red px-6 py-3 font-bold uppercase hover:bg-white hover:text-black transition-colors border-2 border-lyoki-red"
                        >
                            <LogOut size={20} />
                            Sair
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#DC143C] sticky top-24">
                            <div className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 p-4 font-bold uppercase text-left transition-colors border-2 ${activeTab === 'profile'
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-black border-black hover:bg-gray-100'
                                        }`}
                                >
                                    <User size={20} />
                                    Meu Perfil
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center gap-3 p-4 font-bold uppercase text-left transition-colors border-2 ${activeTab === 'orders'
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-black border-black hover:bg-gray-100'
                                        }`}
                                >
                                    <Package size={20} />
                                    Meus Pedidos
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {activeTab === 'profile' ? (
                            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#DC143C]">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="font-grunge text-4xl">INFORMAÇÕES PESSOAIS</h2>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 bg-lyoki-red text-white px-6 py-3 font-bold uppercase hover:bg-black transition-colors border-2 border-lyoki-red"
                                        >
                                            <Edit2 size={18} />
                                            Editar
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-6 py-3 font-bold uppercase border-2 border-black hover:bg-gray-100 transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="px-6 py-3 bg-green-600 text-white font-bold uppercase hover:bg-green-700 transition-colors border-2 border-green-600"
                                            >
                                                Salvar
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {/* Personal Info */}
                                    <div>
                                        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                                            <User size={20} />
                                            Dados Pessoais
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold mb-2 uppercase">Nome</label>
                                                <input
                                                    type="text"
                                                    disabled={!isEditing}
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full border-2 border-black p-3 focus:outline-none focus:border-lyoki-red disabled:bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2 uppercase">Sobrenome</label>
                                                <input
                                                    type="text"
                                                    disabled={!isEditing}
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    className="w-full border-2 border-black p-3 focus:outline-none focus:border-lyoki-red disabled:bg-gray-100"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div>
                                        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                                            <Mail size={20} />
                                            Contato
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold mb-2 uppercase">Email</label>
                                                <input
                                                    type="email"
                                                    disabled={!isEditing}
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full border-2 border-black p-3 focus:outline-none focus:border-lyoki-red disabled:bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2 uppercase">Telefone</label>
                                                <input
                                                    type="tel"
                                                    disabled={!isEditing}
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full border-2 border-black p-3 focus:outline-none focus:border-lyoki-red disabled:bg-gray-100"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-bold mb-2 uppercase">CPF/CNPJ</label>
                                            <input
                                                type="text"
                                                disabled={!isEditing}
                                                value={formData.cpf}
                                                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                                                className="w-full border-2 border-black p-3 focus:outline-none focus:border-lyoki-red disabled:bg-gray-100"
                                            />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                                            <MapPin size={20} />
                                            Endereço
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="grid md:grid-cols-3 gap-4">
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-bold mb-2 uppercase">Rua</label>
                                                    <input
                                                        type="text"
                                                        disabled={!isEditing}
                                                        value={formData.street}
                                                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                                        className="w-full border-2 border-black p-3 focus:outline-none focus:border-lyoki-red disabled:bg-gray-100"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold mb-2 uppercase">Número</label>
                                                    <input
                                                        type="text"
                                                        disabled={!isEditing}
                                                        value={formData.number}
                                                        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                                        className="w-full border-2 border-black p-3 focus:outline-none focus:border-lyoki-red disabled:bg-gray-100"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold mb-2 uppercase">Cidade</label>
                                                    <input
                                                        type="text"
                                                        disabled={!isEditing}
                                                        value={formData.city}
                                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                        className="w-full border-2 border-black p-3 focus:outline-none focus:border-lyoki-red disabled:bg-gray-100"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold mb-2 uppercase">Estado</label>
                                                    <input
                                                        type="text"
                                                        disabled={!isEditing}
                                                        value={formData.state}
                                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                        className="w-full border-2 border-black p-3 focus:outline-none focus:border-lyoki-red disabled:bg-gray-100"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold mb-2 uppercase">CEP</label>
                                                    <input
                                                        type="text"
                                                        disabled={!isEditing}
                                                        value={formData.zipCode}
                                                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                                        className="w-full border-2 border-black p-3 focus:outline-none focus:border-lyoki-red disabled:bg-gray-100"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold mb-2 uppercase">País</label>
                                                    <input
                                                        type="text"
                                                        disabled={!isEditing}
                                                        value={formData.country}
                                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                        className="w-full border-2 border-black p-3 focus:outline-none focus:border-lyoki-red disabled:bg-gray-100"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#DC143C]">
                                    <h2 className="font-grunge text-4xl mb-6">HISTÓRICO DE COMPRAS</h2>

                                    {orders.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Package size={64} className="mx-auto mb-4 text-gray-400" />
                                            <p className="text-xl text-gray-600 mb-4">Você ainda não fez nenhum pedido</p>
                                            <button
                                                onClick={() => navigate('/products')}
                                                className="bg-lyoki-red text-white px-8 py-3 font-bold uppercase hover:bg-black transition-colors border-2 border-lyoki-red"
                                            >
                                                Ir para Loja
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div key={order.id} className="border-2 border-black p-6 bg-gray-50">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div>
                                                            <h3 className="font-bold text-lg">Pedido #{order.id}</h3>
                                                            <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString('pt-BR')}</p>
                                                        </div>
                                                        <span className={`px-4 py-2 font-bold text-sm uppercase border-2 border-black ${getStatusColor(order.status)}`}>
                                                            {getStatusText(order.status)}
                                                        </span>
                                                    </div>

                                                    <div className="space-y-3 mb-4">
                                                        {order.items.map((item) => (
                                                            <div key={item.id} className="flex items-center gap-4 bg-white p-3 border border-gray-300">
                                                                <img src={item.image} alt={item.name} className="w-16 h-20 object-cover" />
                                                                <div className="flex-1">
                                                                    <p className="font-semibold">{item.name}</p>
                                                                    <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                                                                </div>
                                                                <p className="font-bold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-300">
                                                        <div className="text-sm">
                                                            <p className="text-gray-600">Método de entrega: <span className="font-semibold">{order.shippingMethod}</span></p>
                                                            {order.trackingCode && (
                                                                <p className="text-gray-600">Código de rastreio: <span className="font-semibold">{order.trackingCode}</span></p>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm text-gray-600">Total</p>
                                                            <p className="font-bold text-2xl text-lyoki-red">R$ {order.total.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
