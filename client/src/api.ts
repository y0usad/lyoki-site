import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
})

export const getProducts = async () => {
    const response = await api.get('/products');
    return response.data.products || [];
}
export const getProduct = async (id: number) => (await api.get(`/products/${id}`)).data
export const createOrder = async (order: any) => (await api.post('/orders', order)).data

export const loginAdmin = async (creds: any) => (await api.post('/admin/login', creds)).data

// User Authentication
export const loginUser = async (email: string, password: string) => (await api.post('/auth/login', { email, password })).data
export const registerUser = async (userData: any) => (await api.post('/auth/register', userData)).data
export const updateUserProfile = async (id: number, userData: any) => (await api.put(`/auth/profile/${id}`, userData)).data

// Admin Product
export const createProduct = async (data: any) => (await api.post('/admin/products', data)).data
export const updateProduct = async (id: number, data: any) => (await api.put(`/admin/products/${id}`, data)).data
export const deleteProduct = async (id: number) => (await api.delete(`/admin/products/${id}`)).data

// Admin Users
export const getUsers = async () => (await api.get('/admin/users')).data
export const createUser = async (data: any) => (await api.post('/admin/users', data)).data
export const updateUser = async (id: number, data: any) => (await api.put(`/admin/users/${id}`, data)).data
export const deleteUser = async (id: number) => (await api.delete(`/admin/users/${id}`)).data

// Admin Transactions
export const getTransactions = async () => (await api.get('/admin/transactions')).data

export default api
