import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// --- Public Routes ---

// Products
app.get('/api/products', async (req, res) => {
    try {
        const products = await prisma.product.findMany()
        res.json(products)
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' })
    }
})

app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params
        const product = await prisma.product.findUnique({ where: { id: Number(id) } })
        if (!product) {
            res.status(404).json({ error: 'Product not found' })
            return
        }
        res.json(product)
    } catch (error) {
        res.status(500).json({ error: 'Error fetching product' })
    }
})

// Orders (Checkout)
app.post('/api/orders', async (req, res) => {
    try {
        const { items, total, customerName, customerEmail } = req.body

        const order = await prisma.order.create({
            data: {
                total: Number(total),
                customerName: customerName || "Guest",
                customerEmail: customerEmail || "guest@example.com",
                address: req.body.address,
                city: req.body.city,
                postalCode: req.body.postalCode,
                items: {
                    create: items.map((item: any) => ({
                        product: { connect: { id: item.productId } },
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        })
        res.json(order)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error creating order' })
    }
})

// --- Admin Routes ---

// Admin Login
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body
    const admin = await prisma.admin.findUnique({ where: { username } })
    if (admin && admin.password === password) {
        res.json({ success: true, token: 'mock-jwt-token' })
    } else {
        res.status(401).json({ error: 'Invalid credentials' })
    }
})

// Manage Products
app.post('/api/admin/products', async (req, res) => {
    try {
        const { name, price, description, shortDescription, image, category, stock, sizes } = req.body
        const product = await prisma.product.create({
            data: {
                name,
                price: Number(price),
                description,
                shortDescription,
                image,
                category,
                stock: Number(stock),
                sizes // Expecting string "xs,s,m"
            }
        })
        res.json(product)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Failed to create product' })
    }
})

app.put('/api/admin/products/:id', async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body
        const product = await prisma.product.update({
            where: { id: Number(id) },
            data: {
                ...data,
                price: data.price ? Number(data.price) : undefined,
                stock: data.stock ? Number(data.stock) : undefined
            }
        })
        res.json(product)
    } catch (e) {
        console.error("Update Product Error:", e)
        res.status(500).json({ error: 'Failed to update product' })
    }
})

app.delete('/api/admin/products/:id', async (req, res) => {
    try {
        const { id } = req.params
        // Delete order items first constraints usually cascade but lets be safe if needed
        // For now simple delete
        await prisma.product.delete({ where: { id: Number(id) } })
        res.json({ success: true })
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete product' })
    }
})

// Manage Users
app.get('/api/admin/users', async (req, res) => {
    const users = await prisma.user.findMany()
    res.json(users)
})

app.post('/api/admin/users', async (req, res) => {
    try {
        const user = await prisma.user.create({ data: req.body })
        res.json(user)
    } catch (e) {
        res.status(500).json({ error: 'Failed to create user' })
    }
})

app.delete('/api/admin/users/:id', async (req, res) => {
    try {
        await prisma.user.delete({ where: { id: Number(req.params.id) } })
        res.json({ success: true })
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete user' })
    }
})

// Manage Transactions
app.get('/api/admin/transactions', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        })
        res.json(orders)
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch transactions' })
    }
})


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
