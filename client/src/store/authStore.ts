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
    token: string | null
    orders: Order[]
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<boolean>
    register: (userData: Partial<User> & { password: string }) => Promise<boolean>
    loginWithGoogle: (credential: string) => Promise<boolean>
    logout: () => void
    updateUser: (userData: Partial<User>) => Promise<void>
    addOrder: (order: Order) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
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
                        lastName: data.user.lastName || '',
                        phone: data.user.phone || '',
                        cpf: data.user.cpf,
                        address: {
                            street: data.user.street || '',
                            number: data.user.number || '',
                            city: data.user.city || '',
                            state: data.user.state || '',
                            zipCode: data.user.zipCode || '',
                            country: data.user.country || 'Brasil'
                        }
                    }

                    set({ user, token: data.token, isAuthenticated: true })
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
                        lastName: data.user.lastName || '',
                        phone: data.user.phone || '',
                        cpf: data.user.cpf,
                        address: {
                            street: data.user.street || '',
                            number: data.user.number || '',
                            city: data.user.city || '',
                            state: data.user.state || '',
                            zipCode: data.user.zipCode || '',
                            country: data.user.country || 'Brasil'
                        }
                    }

                    set({ user, token: data.token, isAuthenticated: true })
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
                        lastName: data.user.lastName || '',
                        phone: data.user.phone || '',
                        cpf: data.user.cpf,
                        address: {
                            street: data.user.street || '',
                            number: data.user.number || '',
                            city: data.user.city || '',
                            state: data.user.state || '',
                            zipCode: data.user.zipCode || '',
                            country: data.user.country || 'Brasil'
                        }
                    }

                    set({ user, token: data.token, isAuthenticated: true })
                    return true
                } catch (error) {
                    console.error('Google login error:', error)
                    return false
                }
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false, orders: [] })
            },

            updateUser: async (userData) => {
                const currentUser = get().user
                const token = get().token
                if (!currentUser || !token) return

                try {
                    const response = await fetch(`http://localhost:3000/api/auth/profile/${currentUser.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            email: userData.email,
                            name: userData.name,
                            lastName: userData.lastName,
                            phone: userData.phone,
                            cpf: userData.cpf,
                            street: userData.address?.street,
                            number: userData.address?.number,
                            city: userData.address?.city,
                            state: userData.address?.state,
                            zipCode: userData.address?.zipCode,
                            country: userData.address?.country
                        })
                    })

                    if (!response.ok) {
                        throw new Error('Failed to update profile')
                    }

                    const updatedUser = await response.json()

                    // Update local state with all fields
                    set({
                        user: {
                            id: currentUser.id,
                            email: updatedUser.email,
                            name: updatedUser.name,
                            lastName: updatedUser.lastName || '',
                            phone: updatedUser.phone || '',
                            cpf: updatedUser.cpf,
                            address: {
                                street: updatedUser.street || '',
                                number: updatedUser.number || '',
                                city: updatedUser.city || '',
                                state: updatedUser.state || '',
                                zipCode: updatedUser.zipCode || '',
                                country: updatedUser.country || 'Brasil'
                            }
                        }
                    })
                } catch (error) {
                    console.error('Update profile error:', error)
                    throw error
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
