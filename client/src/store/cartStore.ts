import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
    id: number
    name: string
    price: number
    quantity: number
    image: string
}

interface CartState {
    cart: CartItem[]
    isOpen: boolean
    addToCart: (product: any) => void
    removeFromCart: (id: number) => void
    updateQuantity: (id: number, quantity: number) => void
    toggleCart: () => void
    clearCart: () => void
    total: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],
            isOpen: false,
            addToCart: (product) => set((state) => {
                const existing = state.cart.find(item => item.id === product.id)
                if (existing) {
                    return {
                        cart: state.cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
                    }
                }
                return { cart: [...state.cart, { ...product, quantity: 1 }], isOpen: true }
            }),
            removeFromCart: (id) => set((state) => ({ cart: state.cart.filter(item => item.id !== id) })),
            updateQuantity: (id, quantity) => set((state) => ({
                cart: state.cart.map(item => item.id === id ? { ...item, quantity } : item)
            })),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            clearCart: () => set({ cart: [] }),
            total: () => get().cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
        }),
        {
            name: 'lyoki-cart-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ cart: state.cart }), // Only persist cart, not isOpen
        }
    )
)
