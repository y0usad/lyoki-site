import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAdmins, createAdmin, deleteAdmin } from '../../api'
import { Plus, Trash2 } from 'lucide-react'

export default function AdminAdmins() {
    const queryClient = useQueryClient()
    const { data: admins } = useQuery({ queryKey: ['admins'], queryFn: getAdmins })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [selectedId, setSelectedId] = useState<number | null>(null)

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteAdmin(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admins'] })
            setShowDeleteConfirm(false)
            setSelectedId(null)
        }
    })

    const handleDelete = (id: number) => {
        setSelectedId(id)
        setShowDeleteConfirm(true)
    }

    const confirmDelete = () => {
        if (selectedId) {
            deleteMutation.mutate(selectedId)
        }
    }

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center bg-[#111] p-4 rounded-lg border border-gray-800">
                <div>
                    <h1 className="text-white font-bold text-xl">Gerenciar Administradores</h1>
                    <p className="text-gray-400 text-sm mt-1">{admins?.length || 0} administradores cadastrados</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-lyoki-red hover:bg-white hover:text-black text-white px-4 py-2 text-sm font-bold rounded flex items-center gap-2 transition-colors border-2 border-transparent hover:border-black"
                >
                    <Plus size={16} />
                    Adicionar Administrador
                </button>
            </header>

            <div className="bg-[#111] rounded-lg border border-gray-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#0f0f0f] text-gray-400 font-medium border-b border-gray-800">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Username</th>
                            <th className="p-4">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-300">
                        {admins?.map((admin: any) => (
                            <tr key={admin.id} className="hover:bg-[#151515] transition-colors">
                                <td className="p-4 font-semibold text-white">{admin.id}</td>
                                <td className="p-4">
                                    <div className="font-bold text-white">{admin.username}</div>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleDelete(admin.id)}
                                        className="p-2 hover:bg-gray-800 rounded text-red-400 hover:text-red-300 transition-colors"
                                        title="Deletar"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {(!admins || admins.length === 0) && (
                    <div className="p-12 text-center text-gray-500">
                        Nenhum administrador cadastrado
                    </div>
                )}
            </div>

            {isModalOpen && (
                <AdminModal onClose={() => setIsModalOpen(false)} />
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
                            Tem certeza que deseja deletar este administrador?
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

function AdminModal({ onClose }: { onClose: () => void }) {
    const queryClient = useQueryClient()
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

    const mutation = useMutation({
        mutationFn: (data: any) => createAdmin(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admins'] })
            onClose()
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mutation.mutate(formData)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#111] border-2 border-gray-800 rounded-lg max-w-md w-full">
                <div className="sticky top-0 bg-[#111] border-b border-gray-800 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Novo Administrador</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Username</label>
                        <input
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Senha</label>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                            required
                            minLength={6}
                        />
                        <p className="text-gray-500 text-xs mt-1">Mínimo 6 caracteres</p>
                    </div>

                    {mutation.isError && (
                        <div className="bg-red-900/20 border border-red-600 text-red-400 p-3 rounded text-sm">
                            Erro ao criar administrador. Verifique se o username já existe.
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="flex-1 bg-lyoki-red hover:bg-white hover:text-black text-white py-3 font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-50 border-2 border-transparent hover:border-black"
                        >
                            {mutation.isPending ? 'Criando...' : 'Criar'}
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
