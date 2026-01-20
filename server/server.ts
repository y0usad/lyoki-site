import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { z } from 'zod'
import { OAuth2Client } from 'google-auth-library'
import crypto from 'crypto'

// ✅ Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number
                email?: string
                username?: string
                role?: string
            }
        }
    }
}

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000

// ✅ Security: JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production-use-env-variable'
const JWT_EXPIRES_IN = '24h'

// ✅ Security: Google OAuth Client
const GOOGLE_CLIENT_ID = '802903807673-1phb4ojhbvfrqhoj05e3johab97831oj.apps.googleusercontent.com'
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID)

// ✅ Security: Helmet for security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}))

// ✅ Security: CORS with whitelist
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com']
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

app.use(express.json({ limit: '10mb' })) // ✅ Limit payload size

// ✅ Security: Rate Limiters
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Increased from 100 to 1000
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for localhost in development
        const isLocalhost = req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1'
        return process.env.NODE_ENV !== 'production' && isLocalhost
    }
})

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50, // Increased from 5 to 50
    message: 'Too many login attempts, please try again after 15 minutes.',
    skipSuccessfulRequests: true,
    skip: (req) => {
        const isLocalhost = req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1'
        return process.env.NODE_ENV !== 'production' && isLocalhost
    }
})

const orderLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20, // Increased from 3 to 20
    message: 'Too many orders, please wait a moment.',
    skip: (req) => {
        const isLocalhost = req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1'
        return process.env.NODE_ENV !== 'production' && isLocalhost
    }
})

app.use('/api/', generalLimiter)

// ✅ Security: Input Validation Schemas
const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain uppercase letter')
        .regex(/[a-z]/, 'Password must contain lowercase letter')
        .regex(/[0-9]/, 'Password must contain number'),
    name: z.string().min(2).max(100),
    phone: z.string().regex(/^\d{10,11}$/).optional().or(z.literal('')),
    address: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

const orderSchema = z.object({
    items: z.array(z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive().max(100),
    })).min(1),
    customerName: z.string().min(2).max(100).optional(),
    customerEmail: z.string().email().optional(),
    address: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
    postalCode: z.string().regex(/^\d{5}-?\d{3}$/).optional(),
})

// ✅ Validation Middleware
const validate = (schema: z.ZodSchema) => {
    return (req: any, res: any, next: any) => {
        try {
            schema.parse(req.body)
            next()
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: 'Validation error',
                    details: error.issues
                })
            }
            next(error)
        }
    }
}

// ✅ JWT Authentication Middleware
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'Access token required' })
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' })
        }
        req.user = user
        next()
    })
}

// --- Public Routes ---

// Products with pagination
app.get('/api/products', async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1)
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20))
        const skip = (page - 1) * limit

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                skip,
                take: limit,
            }),
            prisma.product.count()
        ])

        res.json({
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Error fetching products')
        res.status(500).json({ error: 'Error fetching products' })
    }
})

app.get('/api/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid product ID' })
        }

        const product = await prisma.product.findUnique({ where: { id } })
        if (!product) {
            return res.status(404).json({ error: 'Product not found' })
        }
        res.json(product)
    } catch (error) {
        console.error('Error fetching product')
        res.status(500).json({ error: 'Error fetching product' })
    }
})

// ✅ FIXED: Orders with price validation and stock management
app.post('/api/orders', orderLimiter, validate(orderSchema), async (req, res) => {
    try {
        const { items, customerName, customerEmail, address, city, postalCode } = req.body

        // ✅ Use transaction to ensure atomicity
        const result = await prisma.$transaction(async (tx) => {
            let calculatedTotal = 0
            const validatedItems = []

            for (const item of items) {
                // ✅ Fetch real price from database
                const product = await tx.product.findUnique({
                    where: { id: item.productId }
                })

                if (!product) {
                    throw new Error(`Product ${item.productId} not found`)
                }

                // ✅ Check stock availability
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`)
                }

                // ✅ Use server-side price, not client price
                const itemTotal = product.price * item.quantity
                calculatedTotal += itemTotal

                // ✅ Decrement stock atomically
                await tx.product.update({
                    where: { id: product.id },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                })

                validatedItems.push({
                    product: { connect: { id: product.id } },
                    quantity: item.quantity,
                    price: product.price // ✅ Server-side price
                })
            }

            // Create order with calculated total
            const order = await tx.order.create({
                data: {
                    total: calculatedTotal, // ✅ Server-calculated total
                    customerName: customerName || "Guest",
                    customerEmail: customerEmail || "guest@example.com",
                    address,
                    city,
                    postalCode,
                    items: {
                        create: validatedItems
                    }
                }
            })

            return order
        })

        res.json(result)
    } catch (error: any) {
        console.error('Order creation error')
        res.status(400).json({ error: error.message || 'Error creating order' })
    }
})

// --- User Authentication Routes ---

// ✅ FIXED: Register with password hashing
app.post('/api/auth/register', authLimiter, validate(registerSchema), async (req, res) => {
    try {
        const { email, password, name, phone, address, city } = req.body

        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' })
        }

        // ✅ Hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword, // ✅ Hashed password
                name,
                phone: phone || '',
                address,
                city,
                status: 'active'
            }
        })

        // ✅ Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        )

        const { password: _, ...userWithoutPassword } = user
        res.json({ success: true, user: userWithoutPassword, token })
    } catch (error) {
        console.error('Registration error')
        res.status(500).json({ error: 'Error creating user' })
    }
})

// ✅ FIXED: Login with password verification
app.post('/api/auth/login', authLimiter, validate(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        // ✅ Compare password with bcrypt
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        if (user.status !== 'active') {
            return res.status(403).json({ error: 'Account is inactive' })
        }

        // ✅ Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        )

        const { password: _, ...userWithoutPassword } = user
        res.json({ success: true, user: userWithoutPassword, token })
    } catch (error) {
        console.error('Login error')
        res.status(500).json({ error: 'Error logging in' })
    }
})

// ✅ Update User Profile (protected)
app.put('/api/auth/profile/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id)

        // ✅ Ensure user can only update their own profile
        if (!req.user || req.user.id !== id) {
            return res.status(403).json({ error: 'Forbidden' })
        }

        const { email, name, lastName, phone, cpf, street, number, city, state, zipCode, country, address } = req.body

        const updateData: any = {}
        if (email !== undefined) updateData.email = email
        if (name !== undefined) updateData.name = name
        if (lastName !== undefined) updateData.lastName = lastName
        if (phone !== undefined) updateData.phone = phone
        if (cpf !== undefined) updateData.cpf = cpf
        if (street !== undefined) updateData.street = street
        if (number !== undefined) updateData.number = number
        if (city !== undefined) updateData.city = city
        if (state !== undefined) updateData.state = state
        if (zipCode !== undefined) updateData.zipCode = zipCode
        if (country !== undefined) updateData.country = country
        if (address !== undefined) updateData.address = address

        const user = await prisma.user.update({
            where: { id },
            data: updateData
        })

        const { password: _, ...userWithoutPassword } = user
        res.json(userWithoutPassword)
    } catch (error) {
        console.error('Profile update error:', error)
        res.status(500).json({ error: 'Error updating profile' })
    }
})

// ✅ FIXED: Google OAuth with proper verification
app.post('/api/auth/google', authLimiter, async (req, res) => {
    try {
        const { credential } = req.body

        // ✅ Verify token with Google library
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        })

        const payload = ticket.getPayload()

        if (!payload || !payload.email) {
            return res.status(400).json({ error: 'Invalid Google token' })
        }

        // ✅ Verify email is verified by Google
        if (!payload.email_verified) {
            return res.status(400).json({ error: 'Email not verified by Google' })
        }

        let user = await prisma.user.findUnique({ where: { email: payload.email } })

        if (!user) {
            // ✅ Create user with random secure password
            const randomPassword = crypto.randomBytes(32).toString('hex')
            const hashedPassword = await bcrypt.hash(randomPassword, 12)

            user = await prisma.user.create({
                data: {
                    email: payload.email,
                    name: payload.given_name || payload.name || 'User',
                    password: hashedPassword,
                    phone: '',
                    status: 'active'
                }
            })
        }

        // ✅ Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        )

        const { password: _, ...userWithoutPassword } = user
        res.json({ success: true, user: userWithoutPassword, token })
    } catch (error) {
        console.error('Google OAuth error')
        res.status(500).json({ error: 'Error processing Google login' })
    }
})

// --- Admin Routes ---

// ✅ FIXED: Admin Login with password hashing and JWT
app.post('/api/admin/login', authLimiter, async (req, res) => {
    try {
        const { username, password } = req.body

        const admin = await prisma.admin.findUnique({ where: { username } })

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        // ✅ Compare password with bcrypt
        const isValidPassword = await bcrypt.compare(password, admin.password)
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        // ✅ Generate real JWT token
        const token = jwt.sign(
            { id: admin.id, username: admin.username, role: 'admin' },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        )

        res.json({ success: true, token })
    } catch (error) {
        console.error('Admin login error')
        res.status(500).json({ error: 'Login failed' })
    }
})

// Admin Management Routes
app.get('/api/admin/admins', authenticateToken, async (req, res) => {
    try {
        const admins = await prisma.admin.findMany({
            select: {
                id: true,
                username: true,
                // Never return password
            }
        })
        res.json(admins)
    } catch (e) {
        console.error('Admins fetch error')
        res.status(500).json({ error: 'Failed to fetch admins' })
    }
})

app.post('/api/admin/admins', authenticateToken, async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' })
        }

        // Check if admin already exists
        const existingAdmin = await prisma.admin.findUnique({ where: { username } })
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin with this username already exists' })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        const admin = await prisma.admin.create({
            data: {
                username,
                password: hashedPassword
            }
        })

        res.json({ id: admin.id, username: admin.username })
    } catch (e) {
        console.error('Admin creation error')
        res.status(500).json({ error: 'Failed to create admin' })
    }
})

app.delete('/api/admin/admins/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        await prisma.admin.delete({ where: { id } })
        res.json({ success: true })
    } catch (e) {
        console.error('Admin deletion error')
        res.status(500).json({ error: 'Failed to delete admin' })
    }
})

// Admin Products (protected)
app.post('/api/admin/products', authenticateToken, async (req, res) => {
    try {
        const { name, price, description, shortDescription, image, category, stock, sizes, isUnique } = req.body
        const product = await prisma.product.create({
            data: {
                name,
                price: Number(price),
                description,
                shortDescription,
                image,
                category,
                stock: Number(stock),
                sizes,
                isUnique: Boolean(isUnique)
            }
        })
        res.json(product)
    } catch (e) {
        console.error('Product creation error')
        res.status(500).json({ error: 'Failed to create product' })
    }
})

app.put('/api/admin/products/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const data = req.body
        const product = await prisma.product.update({
            where: { id },
            data: {
                ...data,
                price: data.price ? Number(data.price) : undefined,
                stock: data.stock ? Number(data.stock) : undefined,
                isUnique: data.isUnique !== undefined ? Boolean(data.isUnique) : undefined
            }
        })
        res.json(product)
    } catch (e) {
        console.error('Product update error')
        res.status(500).json({ error: 'Failed to update product' })
    }
})

app.delete('/api/admin/products/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        await prisma.product.delete({ where: { id } })
        res.json({ success: true })
    } catch (e) {
        console.error('Product deletion error')
        res.status(500).json({ error: 'Failed to delete product' })
    }
})

// Admin Users
app.get('/api/admin/users', authenticateToken, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                lastName: true,
                email: true,
                phone: true,
                cpf: true,
                street: true,
                number: true,
                city: true,
                state: true,
                zipCode: true,
                country: true,
                address: true, // Keep for backward compatibility
                status: true,
                createdAt: true,
                // ✅ Never return password
            }
        })
        res.json(users)
    } catch (e) {
        console.error('Users fetch error')
        res.status(500).json({ error: 'Failed to fetch users' })
    }
})

app.post('/api/admin/users', authenticateToken, async (req, res) => {
    try {
        const { password, ...userData } = req.body

        // ✅ Hash password if provided
        const hashedPassword = password ? await bcrypt.hash(password, 12) : await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 12)

        const user = await prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword
            }
        })

        const { password: _, ...userWithoutPassword } = user
        res.json(userWithoutPassword)
    } catch (e) {
        console.error('User creation error')
        res.status(500).json({ error: 'Failed to create user' })
    }
})

app.put('/api/admin/users/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { password, ...userData } = req.body

        const updateData: any = userData

        // ✅ Only hash password if provided
        if (password) {
            updateData.password = await bcrypt.hash(password, 12)
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData
        })

        const { password: _, ...userWithoutPassword } = user
        res.json(userWithoutPassword)
    } catch (e) {
        console.error('User update error')
        res.status(500).json({ error: 'Failed to update user' })
    }
})

app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        await prisma.user.delete({ where: { id } })
        res.json({ success: true })
    } catch (e) {
        console.error('User deletion error')
        res.status(500).json({ error: 'Failed to delete user' })
    }
})

// Admin Transactions
app.get('/api/admin/transactions', authenticateToken, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        })
        res.json(orders)
    } catch (e) {
        console.error('Transactions fetch error')
        res.status(500).json({ error: 'Failed to fetch transactions' })
    }
})

// ✅ Global error handler
app.use((err: any, req: any, res: any, next: any) => {
    console.error('Global error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`)
    console.log(`🔒 Security features enabled:`)
    console.log(`   - Rate limiting`)
    console.log(`   - Input validation`)
    console.log(`   - Password hashing`)
    console.log(`   - JWT authentication`)
    console.log(`   - CORS protection`)
    console.log(`   - Helmet security headers`)
})
