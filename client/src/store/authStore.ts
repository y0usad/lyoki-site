import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface User {
    id: number
    email: string
    name: string
    lastName: string
    phone: string
    cpf?: string
    address?: {
        street: string
        number: string
        city: string
        state: string
        zipCode: string
        country: string
    }
}

export interface Order {
    id: number
    date: string
    items: Array<{
        id: number
        name: string
        price: number
        quantity: number
        image: string
    }>
    total: number
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    shippingMethod: string
    shippingCost: number
    trackingCode?: string
}

interface AuthState {
    user: User | null
    orders: Order[]
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<boolean>
    register: (userData: Partial<User> & { password: string }) => Promise<boolean>
    loginWithGoogle: (credential: string) => Promise<boolean>
    logout: () => void
    updateUser: (userData: Partial<User>) => void
    addOrder: (order: Order) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            orders: [],
            isAuthenticated: false,

            login: async (email: string, password: string) => {
                try {
                    const response = await fetch('http://localhost:3000/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    })

                    if (!response.ok) {
                        const error = await response.json()
                        throw new Error(error.error || 'Login failed')
                    }

                    const data = await response.json()
                    const user: User = {
                        id: data.user.id,
                        email: data.user.email,
                        name: data.user.name,
                        lastName: '', // Backend doesn't have lastName yet
                        phone: data.user.phone || '',
                        address: data.user.address ? {
                            street: data.user.address,
                            number: '',
                            city: data.user.city || '',
                            state: '',
                            zipCode: '',
                            country: 'Brasil'
                        } : undefined
                    }

                    set({ user, isAuthenticated: true })
                    return true
                } catch (error) {
                    console.error('Login error:', error)
                    return false
                }
            },

            register: async (userData) => {
                try {
                    const response = await fetch('http://localhost:3000/api/auth/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: userData.email,
                            password: userData.password,
                            name: userData.name,
                            phone: userData.phone,
                            address: userData.address?.street,
                            city: userData.address?.city
                        })
                    })

                    if (!response.ok) {
                        const error = await response.json()
                        throw new Error(error.error || 'Registration failed')
                    }

                    const data = await response.json()
                    const user: User = {
                        id: data.user.id,
                        email: data.user.email,
                        name: data.user.name,
                        lastName: userData.lastName || '',
                        phone: data.user.phone || '',
                        address: data.user.address ? {
                            street: data.user.address,
                            number: '',
                            city: data.user.city || '',
                            state: '',
                            zipCode: '',
                            country: 'Brasil'
                        } : undefined
                    }

                    set({ user, isAuthenticated: true })
                    return true
                } catch (error) {
                    console.error('Registration error:', error)
                    return false
                }
            },

            loginWithGoogle: async (credential: string) => {
                try {
                    const response = await fetch('http://localhost:3000/api/auth/google', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ credential })
                    })

                    if (!response.ok) {
                        const error = await response.json()
                        throw new Error(error.error || 'Google login failed')
                    }

                    const data = await response.json()
                    const user: User = {
                        id: data.user.id,
                        email: data.user.email,
                        name: data.user.name,
                        lastName: '',
                        phone: data.user.phone || '',
                        address: data.user.address ? {
                            street: data.user.address,
                            number: '',
                            city: data.user.city || '',
                            state: '',
                            zipCode: '',
                            country: 'Brasil'
                        } : undefined
                    }

                    set({ user, isAuthenticated: true })
                    return true
                } catch (error) {
                    console.error('Google login error:', error)
                    return false
                }
            },

            logout: () => {
                set({ user: null, isAuthenticated: false, orders: [] })
            },

            updateUser: async (userData) => {
                const currentUser = get().user
                if (!currentUser) return

                try {
                    const response = await fetch(`http://localhost:3000/api/auth/profile/${currentUser.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: userData.email || currentUser.email,
                            name: userData.name || currentUser.name,
                            phone: userData.phone || currentUser.phone,
                            address: userData.address?.street,
                            city: userData.address?.city
                        })
                    })

                    if (!response.ok) {
                        throw new Error('Failed to update profile')
                    }

                    const updatedUser = await response.json()
                    set({
                        user: {
                            ...currentUser,
                            ...userData,
                            email: updatedUser.email,
                            name: updatedUser.name,
                            phone: updatedUser.phone
                        }
                    })
                } catch (error) {
                    console.error('Update profile error:', error)
                }
            },

            addOrder: (order) => {
                set((state) => ({ orders: [order, ...state.orders] }))
            }
        }),
        {
            name: 'lyoki-auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
