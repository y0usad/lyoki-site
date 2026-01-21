import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { useAuthStore } from '../store/authStore'
import { usePageTitle } from '../hooks/usePageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'

export default function Login() {
    usePageTitle('LYOKI > LOGIN')

    const navigate = useNavigate()
    const { login, register, loginWithGoogle } = useAuthStore()
    const [isLogin, setIsLogin] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        lastName: '',
        phone: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (isLogin) {
                const success = await login(formData.email, formData.password)
                if (success) {
                    navigate('/account')
                } else {
                    setError('Email ou senha inválidos. Tente novamente.')
                }
            } else {
                const success = await register(formData)
                if (success) {
                    navigate('/account')
                } else {
                    setError('Erro ao criar conta. Verifique se a senha tem pelo menos 8 caracteres, com letras maiúsculas, minúsculas e números.')
                }
            }
        } catch (error: any) {
            console.error('Error:', error)
            setError(error.message || 'Ocorreu um erro. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            if (credentialResponse.credential) {
                const success = await loginWithGoogle(credentialResponse.credential)
                if (success) {
                    navigate('/account')
                }
            }
        } catch (error) {
            console.error('Google login error:', error)
        }
    }

    const handleGoogleError = () => {
        console.error('Google login failed')
        alert('Falha ao fazer login com Google. Tente novamente.')
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-black text-white py-12 border-b-4 border-lyoki-red">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="font-grunge text-6xl mb-2">{isLogin ? 'LOGIN' : 'CRIAR CONTA'}</h1>
                    <p className="text-gray-400 text-lg">
                        {isLogin ? 'Entre para acessar sua conta' : 'Cadastre-se para começar'}
                    </p>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 py-16">
                <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#DC143C]">
                    {/* Toggle Buttons */}
                    <div className="grid grid-cols-2 gap-2 mb-8">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`py-3 font-bold uppercase text-sm transition-colors border-2 ${isLogin
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-black border-black hover:bg-gray-100'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`py-3 font-bold uppercase text-sm transition-colors border-2 ${!isLogin
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-black border-black hover:bg-gray-100'
                                }`}
                        >
                            Criar Conta
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Fields (Register Only) */}
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm font-bold mb-2 uppercase">Nome *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full border-2 border-black p-3 pl-12 focus:outline-none focus:border-lyoki-red"
                                            placeholder="Digite seu nome"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2 uppercase">Sobrenome *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full border-2 border-black p-3 pl-12 focus:outline-none focus:border-lyoki-red"
                                            placeholder="Digite seu sobrenome"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2 uppercase">Telefone *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full border-2 border-black p-3 pl-12 focus:outline-none focus:border-lyoki-red"
                                            placeholder="(00) 00000-0000"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Email *</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full border-2 border-black p-3 pl-12 focus:outline-none focus:border-lyoki-red"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Senha *</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full border-2 border-black p-3 pl-12 pr-12 focus:outline-none focus:border-lyoki-red"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password (Login Only) */}
                        {isLogin && (
                            <div className="text-right">
                                <Link to="#" className="text-sm text-gray-600 hover:text-lyoki-red underline">
                                    Esqueceu a senha?
                                </Link>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-3 font-semibold">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Password Requirements (Register Only) */}
                        {!isLogin && (
                            <div className="bg-blue-50 border-2 border-blue-300 text-blue-800 px-4 py-3 text-sm">
                                <strong>Requisitos da senha:</strong>
                                <ul className="list-disc list-inside mt-1">
                                    <li>Mínimo 8 caracteres</li>
                                    <li>Pelo menos 1 letra maiúscula</li>
                                    <li>Pelo menos 1 letra minúscula</li>
                                    <li>Pelo menos 1 número</li>
                                </ul>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-lyoki-red text-white py-4 font-bold uppercase text-lg hover:bg-black transition-colors border-4 border-lyoki-red hover:border-black disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar Conta'}
                        </button>
                    </form>

                    {/* Social Login */}
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t-2 border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 uppercase font-semibold">Ou continue com</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                theme="outline"
                                size="large"
                                text={isLogin ? "signin_with" : "signup_with"}
                                width="384"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
