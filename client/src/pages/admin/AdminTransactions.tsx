import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTransactions } from '../../api'
import { ChevronDown, ChevronUp, Package, MapPin, CreditCard, Calendar } from 'lucide-react'

export default function AdminTransactions() {
    const { data: transactions } = useQuery({ queryKey: ['transactions'], queryFn: getTransactions })
    const [expandedId, setExpandedId] = useState<number | null>(null)

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id)
    }

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center bg-[#111] p-4 rounded-lg border border-gray-800">
                <div>
                    <h1 className="text-white font-bold text-xl">Todas as Transações</h1>
                    <p className="text-gray-400 text-sm mt-1">{transactions?.length || 0} pedidos registrados</p>
                </div>
            </header>

            <div className="space-y-4">
                {transactions?.map((t: any) => (
                    <div key={t.id} className="bg-[#111] border border-gray-800 rounded-lg overflow-hidden">
                        {/* Header Row */}
                        <div
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#151515] transition-colors"
                            onClick={() => toggleExpand(t.id)}
                        >
                            <div className="flex items-center gap-6 flex-1">
                                <div className="text-gray-400 font-mono text-sm">
                                    #{String(t.id).padStart(4, '0')}
                                </div>

                                <div className="flex-1">
                                    <div className="font-bold text-white">{t.customerName || 'Cliente Anônimo'}</div>
                                    <div className="text-xs text-gray-500">{t.customerEmail}</div>
                                </div>

                                <div className="text-right">
                                    <div className="text-2xl font-bold text-white">R$ {t.total.toFixed(2)}</div>
                                    <div className="text-xs text-gray-500">{new Date(t.createdAt).toLocaleDateString('pt-BR')}</div>
                                </div>

                                <span className={`px-3 py-1 rounded text-xs font-bold ${t.status === 'PAID' ? 'bg-green-900/30 text-green-500' :
                                        t.status === 'SHIPPED' ? 'bg-blue-900/30 text-blue-500' :
                                            'bg-yellow-900/30 text-yellow-500'
                                    }`}>
                                    {t.status === 'PAID' ? 'PAGO' : t.status === 'SHIPPED' ? 'ENVIADO' : 'PENDENTE'}
                                </span>

                                <button className="text-gray-400 hover:text-white">
                                    {expandedId === t.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedId === t.id && (
                            <div className="border-t border-gray-800 bg-[#0a0a0a] p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {/* Customer Info */}
                                    <div className="space-y-3">
                                        <h3 className="text-white font-bold flex items-center gap-2 mb-3">
                                            <MapPin size={16} className="text-lyoki-red" />
                                            Endereço de Entrega
                                        </h3>
                                        <div className="text-gray-400 text-sm space-y-1 pl-6">
                                            <p className="text-white font-semibold">{t.customerName}</p>
                                            <p>{t.address || 'Não informado'}</p>
                                            <p>{t.city || 'Não informado'} - CEP: {t.postalCode || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Payment Info */}
                                    <div className="space-y-3">
                                        <h3 className="text-white font-bold flex items-center gap-2 mb-3">
                                            <CreditCard size={16} className="text-lyoki-red" />
                                            Informações de Pagamento
                                        </h3>
                                        <div className="text-gray-400 text-sm space-y-1 pl-6">
                                            <p>Método: <span className="text-white">{t.paymentMethod || 'Cartão de Crédito'}</span></p>
                                            <p className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(t.createdAt).toLocaleString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="space-y-3">
                                    <h3 className="text-white font-bold flex items-center gap-2 mb-3">
                                        <Package size={16} className="text-lyoki-red" />
                                        Itens do Pedido
                                    </h3>
                                    <div className="space-y-2">
                                        {t.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between bg-[#111] p-3 rounded border border-gray-800">
                                                <div className="flex items-center gap-3">
                                                    {item.product && (
                                                        <img
                                                            src={item.product.image}
                                                            alt={item.product.name}
                                                            className="w-12 h-14 object-cover border border-gray-700"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="text-white font-semibold text-sm">
                                                            {item.product ? item.product.name : 'Produto Removido'}
                                                        </p>
                                                        <p className="text-gray-500 text-xs">Quantidade: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-white font-bold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                                                    <p className="text-gray-500 text-xs">R$ {item.price.toFixed(2)} cada</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {(!transactions || transactions.length === 0) && (
                    <div className="bg-[#111] border border-gray-800 rounded-lg p-12 text-center">
                        <Package size={48} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400">Nenhuma transação encontrada</p>
                    </div>
                )}
            </div>
        </div>
    )
}
