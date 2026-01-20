import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api'
import { Pencil, Plus, Trash2 } from 'lucide-react'

export default function AdminProducts() {
    const queryClient = useQueryClient()
    const { data: products } = useQuery({ queryKey: ['products'], queryFn: getProducts })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const deleteMutation = useMutation({
        mutationFn: async (ids: number[]) => {
            await Promise.all(ids.map(id => deleteProduct(id)))
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            setSelectedIds([])
            setShowDeleteConfirm(false)
        }
    })

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(products?.map((p: any) => p.id) || [])
        } else {
            setSelectedIds([])
        }
    }

    const handleSelectOne = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return
        setShowDeleteConfirm(true)
    }

    const confirmDelete = () => {
        deleteMutation.mutate(selectedIds)
    }

    const handleEdit = (product: any) => {
        setEditingProduct(product)
        setIsModalOpen(true)
    }

    const handleAdd = () => {
        setEditingProduct(null)
        setIsModalOpen(true)
    }

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center bg-[#111] p-4 rounded-lg border border-gray-800">
                <div>
                    <h1 className="text-white font-bold text-xl">Gerenciar Produtos</h1>
                    <p className="text-gray-400 text-sm mt-1">{products?.length || 0} produtos cadastrados</p>
                </div>
                <div className="flex gap-3">
                    {selectedIds.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-bold rounded flex items-center gap-2 transition-colors"
                        >
                            <Trash2 size={16} />
                            Deletar Selecionados ({selectedIds.length})
                        </button>
                    )}
                    <button
                        onClick={handleAdd}
                        className="bg-lyoki-red hover:bg-white hover:text-black text-white px-4 py-2 text-sm font-bold rounded flex items-center gap-2 transition-colors border-2 border-transparent hover:border-black"
                    >
                        <Plus size={16} />
                        Adicionar Produto
                    </button>
                </div>
            </header>

            <div className="bg-[#111] rounded-lg border border-gray-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#0f0f0f] text-gray-400 font-medium border-b border-gray-800">
                        <tr>
                            <th className="p-4 w-12">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === products?.length && products?.length > 0}
                                    onChange={handleSelectAll}
                                    className="bg-transparent border-gray-600 rounded cursor-pointer"
                                />
                            </th>
                            <th className="p-4">Imagem</th>
                            <th className="p-4">Nome</th>
                            <th className="p-4">Preço</th>
                            <th className="p-4">Estoque</th>
                            <th className="p-4">Categoria</th>
                            <th className="p-4">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-300">
                        {products?.map((p: any) => (
                            <tr key={p.id} className={`hover:bg-[#151515] transition-colors ${selectedIds.includes(p.id) ? 'bg-gray-900' : ''}`}>
                                <td className="p-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(p.id)}
                                        onChange={() => handleSelectOne(p.id)}
                                        className="bg-transparent border-gray-600 rounded cursor-pointer"
                                    />
                                </td>
                                <td className="p-4">
                                    <img src={p.image} alt={p.name} className="w-12 h-14 object-cover border border-gray-700" />
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-white">{p.name}</div>
                                    <div className="text-xs text-gray-500 mt-1">{p.shortDescription}</div>
                                </td>
                                <td className="p-4 font-semibold text-white">R$ {p.price.toFixed(2)}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${p.stock > 10 ? 'bg-green-900/30 text-green-500' : p.stock > 0 ? 'bg-yellow-900/30 text-yellow-500' : 'bg-red-900/30 text-red-500'}`}>
                                        {p.stock} un.
                                    </span>
                                </td>
                                <td className="p-4 text-gray-400">{p.category}</td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="p-2 hover:bg-gray-800 rounded text-blue-400 hover:text-blue-300 transition-colors"
                                            title="Editar produto"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedIds([p.id])
                                                setShowDeleteConfirm(true)
                                            }}
                                            className="p-2 hover:bg-gray-800 rounded text-red-400 hover:text-red-300 transition-colors"
                                            title="Deletar produto"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {(!products || products.length === 0) && (
                    <div className="p-12 text-center text-gray-500">
                        Nenhum produto cadastrado
                    </div>
                )}
            </div>

            {isModalOpen && (
                <ProductModal
                    product={editingProduct}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#111] border-2 border-red-600 rounded-lg max-w-md w-full mx-4 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-600/20 p-3 rounded-full">
                                <Trash2 size={24} className="text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">Confirmar Exclusão</h3>
                                <p className="text-gray-400 text-sm">Esta ação não pode ser desfeita</p>
                            </div>
                        </div>

                        <p className="text-gray-300 mb-6">
                            Tem certeza que deseja deletar <span className="text-red-500 font-bold">{selectedIds.length}</span> produto(s) selecionado(s)?
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={confirmDelete}
                                disabled={deleteMutation.isPending}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 font-bold uppercase rounded transition-colors disabled:opacity-50"
                            >
                                {deleteMutation.isPending ? 'Deletando...' : 'Sim, Deletar'}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleteMutation.isPending}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 font-bold uppercase rounded transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function ProductModal({ product, onClose }: { product: any; onClose: () => void }) {
    const queryClient = useQueryClient()
    const [formData, setFormData] = useState(product || {
        name: '',
        price: '',
        description: '',
        shortDescription: '',
        image: '',
        category: '',
        stock: '',
        sizes: '',
        isUnique: false
    })

    const mutation = useMutation({
        mutationFn: (data: any) => {
            const payload = {
                ...data,
                price: parseFloat(data.price),
                stock: parseInt(data.stock)
            }

            if (product) {
                return updateProduct(product.id, payload)
            }
            return createProduct(payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            onClose()
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mutation.mutate(formData)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#111] border-2 border-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-[#111] border-b border-gray-800 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">
                        {product ? 'Editar Produto' : 'Novo Produto'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-gray-400 text-sm mb-2">Nome do Produto</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Preço (R$)</label>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Estoque</label>
                            <input
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Categoria</label>
                            <input
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Tamanhos (separados por vírgula)</label>
                            <input
                                name="sizes"
                                value={formData.sizes}
                                onChange={handleChange}
                                placeholder="P,M,G,GG"
                                className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-gray-400 text-sm mb-2">URL da Imagem</label>
                            <input
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                                required
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-gray-400 text-sm mb-2">Descrição Curta</label>
                            <input
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-gray-400 text-sm mb-2">Descrição Completa</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none resize-none"
                                required
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isUnique}
                                    onChange={(e) => setFormData({ ...formData, isUnique: e.target.checked })}
                                    className="w-5 h-5 bg-[#0a0a0a] border border-gray-700 rounded focus:ring-lyoki-red cursor-pointer"
                                />
                                <span className="text-white font-bold">PRODUTO ÚNICO</span>
                                <span className="text-gray-400 text-sm">(Exibirá badge "PRODUTO ÚNICO" no site)</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="flex-1 bg-lyoki-red hover:bg-white hover:text-black text-white py-3 font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-50 border-2 border-transparent hover:border-black"
                        >
                            {mutation.isPending ? 'Salvando...' : product ? 'Atualizar' : 'Criar'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 bg-gray-800 hover:bg-gray-700 text-white py-3 font-bold uppercase rounded transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
