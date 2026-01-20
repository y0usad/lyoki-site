import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsers, createUser, updateUser, deleteUser } from '../../api'
import { Plus, Trash2, Mail, Phone, MapPin, Edit } from 'lucide-react'

export default function AdminUsers() {
    const queryClient = useQueryClient()
    const { data: users } = useQuery({ queryKey: ['users'], queryFn: getUsers })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<any>(null)
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const deleteMutation = useMutation({
        mutationFn: async (ids: number[]) => {
            await Promise.all(ids.map(id => deleteUser(id)))
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            setSelectedIds([])
            setShowDeleteConfirm(false)
        }
    })

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(users?.map((u: any) => u.id) || [])
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

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center bg-[#111] p-4 rounded-lg border border-gray-800">
                <div>
                    <h1 className="text-white font-bold text-xl">Gerenciar Usuários</h1>
                    <p className="text-gray-400 text-sm mt-1">{users?.length || 0} usuários cadastrados</p>
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
                        onClick={() => setIsModalOpen(true)}
                        className="bg-lyoki-red hover:bg-white hover:text-black text-white px-4 py-2 text-sm font-bold rounded flex items-center gap-2 transition-colors border-2 border-transparent hover:border-black"
                    >
                        <Plus size={16} />
                        Adicionar Usuário
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
                                    checked={selectedIds.length === users?.length && users?.length > 0}
                                    onChange={handleSelectAll}
                                    className="bg-transparent border-gray-600 rounded cursor-pointer"
                                />
                            </th>
                            <th className="p-4">Nome</th>
                            <th className="p-4">Contato</th>
                            <th className="p-4">CPF/CNPJ</th>
                            <th className="p-4">Localização</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Cadastro</th>
                            <th className="p-4">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-300">
                        {users?.map((u: any) => (
                            <tr key={u.id} className={`hover:bg-[#151515] transition-colors ${selectedIds.includes(u.id) ? 'bg-gray-900' : ''}`}>
                                <td className="p-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(u.id)}
                                        onChange={() => handleSelectOne(u.id)}
                                        className="bg-transparent border-gray-600 rounded cursor-pointer"
                                    />
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-white">{u.name}</div>
                                    {u.lastName && <div className="text-xs text-gray-500">{u.lastName}</div>}
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1 text-xs">
                                        <div className="flex items-center gap-2">
                                            <Mail size={12} className="text-gray-500" />
                                            <span>{u.email}</span>
                                        </div>
                                        {u.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone size={12} className="text-gray-500" />
                                                <span>{u.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4">
                                    {u.cpf ? (
                                        <span className="text-xs font-mono">{u.cpf}</span>
                                    ) : (
                                        <span className="text-gray-600 text-xs">Não informado</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {(u.city || u.state) ? (
                                        <div className="flex flex-col gap-1 text-xs">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={12} className="text-gray-500" />
                                                <span>{u.city}{u.state && `, ${u.state}`}</span>
                                            </div>
                                            {u.street && (
                                                <div className="text-gray-600">
                                                    {u.street}{u.number && `, ${u.number}`}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-gray-600 text-xs">Não informado</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.status === 'active' ? 'bg-green-900/30 text-green-500' : 'bg-gray-800 text-gray-500'}`}>
                                        {u.status === 'active' ? 'ATIVO' : 'INATIVO'}
                                    </span>
                                </td>
                                <td className="p-4 text-xs text-gray-500">
                                    {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => {
                                            setEditingUser(u)
                                            setIsModalOpen(true)
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors"
                                        title="Editar usuário"
                                    >
                                        <Edit size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {(!users || users.length === 0) && (
                    <div className="p-12 text-center text-gray-500">
                        Nenhum usuário cadastrado
                    </div>
                )}
            </div>

            {isModalOpen && (
                <UserModal
                    user={editingUser}
                    onClose={() => {
                        setIsModalOpen(false)
                        setEditingUser(null)
                    }}
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
                            Tem certeza que deseja deletar <span className="text-red-500 font-bold">{selectedIds.length}</span> usuário(s) selecionado(s)?
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

function UserModal({ user, onClose }: { user?: any; onClose: () => void }) {
    const queryClient = useQueryClient()
    const isEditing = !!user

    const [formData, setFormData] = useState({
        name: user?.name || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        cpf: user?.cpf || '',
        street: user?.street || '',
        number: user?.number || '',
        city: user?.city || '',
        state: user?.state || '',
        zipCode: user?.zipCode || '',
        country: user?.country || 'Brasil',
        status: user?.status || 'active',
        password: ''
    })

    // ✅ Update formData when user changes (fixes bug where existing data wasn't loaded)
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                cpf: user.cpf || '',
                street: user.street || '',
                number: user.number || '',
                city: user.city || '',
                state: user.state || '',
                zipCode: user.zipCode || '',
                country: user.country || 'Brasil',
                status: user.status || 'active',
                password: ''
            })
        }
    }, [user])


    const createMutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            onClose()
        }
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            onClose()
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (isEditing) {
            // Don't send password if it's empty during edit
            const updateData: any = { ...formData }
            if (!updateData.password) {
                delete updateData.password
            }
            updateMutation.mutate({ id: user.id, data: updateData })
        } else {
            createMutation.mutate(formData)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const isPending = createMutation.isPending || updateMutation.isPending

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#111] rounded-lg border-2 border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-[#111] border-b border-gray-800 p-6 flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-2xl font-bold text-white">
                        {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Dados Pessoais */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="text-lyoki-red">👤</span> Dados Pessoais
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Nome *</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Sobrenome</label>
                                <input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contato */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="text-lyoki-red">📧</span> Contato
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Email *</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Telefone</label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                                    placeholder="(00) 00000-0000"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-gray-400 text-sm mb-2">CPF/CNPJ</label>
                                <input
                                    name="cpf"
                                    value={formData.cpf}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                                    placeholder="000.000.000-00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Endereço */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="text-lyoki-red">📍</span> Endereço
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Rua</label>
                                <input
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Número</label>
                                <input
                                    name="number"
                                    value={formData.number}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Cidade</label>
                                <input
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Estado</label>
                                <input
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                                    placeholder="SP"
                                    maxLength={2}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">CEP</label>
                                <input
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                                    placeholder="00000-000"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">País</label>
                                <input
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Configurações */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="text-lyoki-red">⚙️</span> Configurações
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                                >
                                    <option value="active">Ativo</option>
                                    <option value="inactive">Inativo</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">
                                    Senha {isEditing && <span className="text-xs text-gray-500">(deixe em branco para não alterar)</span>}
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded focus:border-lyoki-red outline-none"
                                    required={!isEditing}
                                    placeholder={isEditing ? "••••••••" : "Mín. 8 caracteres"}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-800">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 bg-lyoki-red hover:bg-white hover:text-black text-white py-3 font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-50 border-2 border-transparent hover:border-black"
                        >
                            {isPending
                                ? (isEditing ? 'Salvando...' : 'Criando...')
                                : (isEditing ? 'Salvar Alterações' : 'Criar Usuário')
                            }
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
