import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../api'

export default function Admin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await loginAdmin({ username, password })
            if (res.success) {
                localStorage.setItem('token', res.token)
                navigate('/admin/products') // Redirect to the dashboard
            }
        } catch {
            alert('Login failed')
        }
    }

    return (
        <div className="flex h-screen items-center justify-center bg-[#0a0a0a] font-sans">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />

            <form onSubmit={handleLogin} className="bg-[#111] p-8 border border-white/10 w-96 space-y-6 relative z-10">
                <h1 className="text-3xl font-grunge mb-4 text-center text-white">Admin Access</h1>
                <div>
                    <label className="text-xs text-gray-500 uppercase font-bold">Username</label>
                    <input className="bg-[#1a1a1a] border border-white/20 p-3 w-full outline-none text-white focus:border-white" placeholder="admin" value={username} onChange={e => setUsername(e.target.value)} />
                </div>
                <div>
                    <label className="text-xs text-gray-500 uppercase font-bold">Password</label>
                    <input className="bg-[#1a1a1a] border border-white/20 p-3 w-full outline-none text-white focus:border-white" type="password" placeholder="password123" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button className="bg-white text-black w-full py-3 font-bold uppercase tracking-widest hover:bg-lyoki-red hover:text-white transition-colors">Login</button>
            </form>
        </div>
    )
}
