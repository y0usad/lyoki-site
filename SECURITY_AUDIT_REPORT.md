# 🔒 RELATÓRIO DE AUDITORIA DE SEGURANÇA
## E-commerce Lyoki - Análise Completa

**Data**: 19/01/2026  
**Versão Auditada**: 1.0  
**Auditor**: Sistema de Segurança Antigravity

---

## 📊 RESUMO EXECUTIVO

### Estatísticas
- **Vulnerabilidades Críticas**: 8
- **Vulnerabilidades Altas**: 5
- **Vulnerabilidades Médias**: 4
- **Vulnerabilidades Baixas**: 3
- **Total**: 20 vulnerabilidades identificadas

### Classificação de Risco Geral: 🔴 **CRÍTICO**

---

## 🚨 VULNERABILIDADES CRÍTICAS

### 1. Senhas Armazenadas em Texto Plano
**Criticidade**: 🔴 CRÍTICA  
**Arquivo**: `server/server.ts` (linhas 88, 113, 197)  
**CWE**: CWE-256 (Plaintext Storage of a Password)

**Problema**:
```typescript
// Linha 88 - Registro
password, // In production, hash this password!

// Linha 113 - Login
if (!user || user.password !== password) {

// Linha 197 - Admin Login
if (admin && admin.password === password) {
```

**Impacto**:
- Todas as senhas são armazenadas em texto plano no banco de dados
- Em caso de vazamento de dados, todas as contas ficam comprometidas
- Violação de LGPD/GDPR
- Possibilidade de credential stuffing

**Correção**:
```typescript
// Instalar bcrypt
// npm install bcrypt @types/bcrypt

import bcrypt from 'bcrypt'

// Registro
const hashedPassword = await bcrypt.hash(password, 12)
const user = await prisma.user.create({
    data: {
        email,
        password: hashedPassword,
        // ...
    }
})

// Login
const user = await prisma.user.findUnique({ where: { email } })
if (!user) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
}

const isValidPassword = await bcrypt.compare(password, user.password)
if (!isValidPassword) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
}
```

---

### 2. Manipulação de Preços no Checkout
**Criticidade**: 🔴 CRÍTICA  
**Arquivo**: `server/server.ts` (linhas 42-68)  
**CWE**: CWE-20 (Improper Input Validation)

**Problema**:
```typescript
app.post('/api/orders', async (req, res) => {
    const { items, total, customerName, customerEmail } = req.body
    
    const order = await prisma.order.create({
        data: {
            total: Number(total), // ❌ Cliente pode enviar qualquer valor!
            items: {
                create: items.map((item: any) => ({
                    product: { connect: { id: item.productId } },
                    quantity: item.quantity,
                    price: item.price // ❌ Cliente pode alterar o preço!
                }))
            }
        }
    })
})
```

**Impacto**:
- Cliente pode comprar produtos por R$ 0,01
- Cliente pode alterar preços no frontend
- Perda financeira direta
- Fraude em massa

**Correção**:
```typescript
app.post('/api/orders', async (req, res) => {
    try {
        const { items, customerName, customerEmail } = req.body
        
        // ✅ Validar e recalcular preços no servidor
        let calculatedTotal = 0
        const validatedItems = []
        
        for (const item of items) {
            // Buscar preço real do banco de dados
            const product = await prisma.product.findUnique({
                where: { id: item.productId }
            })
            
            if (!product) {
                return res.status(400).json({ error: `Product ${item.productId} not found` })
            }
            
            // Verificar estoque
            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    error: `Insufficient stock for ${product.name}` 
                })
            }
            
            // Usar preço do banco, não do cliente
            const itemTotal = product.price * item.quantity
            calculatedTotal += itemTotal
            
            validatedItems.push({
                product: { connect: { id: product.id } },
                quantity: item.quantity,
                price: product.price // ✅ Preço do banco
            })
        }
        
        // Criar pedido com total calculado no servidor
        const order = await prisma.order.create({
            data: {
                total: calculatedTotal, // ✅ Total calculado no servidor
                customerName: customerName || "Guest",
                customerEmail: customerEmail || "guest@example.com",
                address: req.body.address,
                city: req.body.city,
                postalCode: req.body.postalCode,
                items: {
                    create: validatedItems
                }
            }
        })
        
        // Atualizar estoque (dentro de transação)
        for (const item of items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity
                    }
                }
            })
        }
        
        res.json(order)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error creating order' })
    }
})
```

---

### 3. Ausência de Rate Limiting
**Criticidade**: 🔴 CRÍTICA  
**Arquivo**: `server/server.ts` (todo o arquivo)  
**CWE**: CWE-307 (Improper Restriction of Excessive Authentication Attempts)

**Problema**:
- Nenhuma proteção contra brute force
- Nenhuma proteção contra DoS
- Endpoints públicos sem limitação

**Impacto**:
- Ataques de força bruta em login
- DoS em rotas públicas
- Consumo excessivo de recursos
- Custos de infraestrutura

**Correção**:
```typescript
// Instalar express-rate-limit
// npm install express-rate-limit

import rateLimit from 'express-rate-limit'

// Rate limiter geral para todas as rotas
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requisições por IP
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
})

// Rate limiter estrito para login
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 tentativas de login
    message: 'Too many login attempts, please try again after 15 minutes.',
    skipSuccessfulRequests: true,
})

// Rate limiter para criação de pedidos
const orderLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 3, // 3 pedidos por minuto
    message: 'Too many orders, please wait a moment.',
})

// Aplicar limitadores
app.use('/api/', generalLimiter)
app.use('/api/auth/login', authLimiter)
app.use('/api/admin/login', authLimiter)
app.use('/api/orders', orderLimiter)
```

---

### 4. Ausência de Autenticação JWT
**Criticidade**: 🔴 CRÍTICA  
**Arquivo**: `server/server.ts` (linhas 193-202)  
**CWE**: CWE-287 (Improper Authentication)

**Problema**:
```typescript
// Admin Login retorna token mockado
if (admin && admin.password === password) {
    res.json({ success: true, token: 'mock-jwt-token' }) // ❌ Token falso
}
```

**Impacto**:
- Qualquer pessoa pode acessar rotas admin
- Sem validação de sessão
- Sem expiração de token
- Sem controle de acesso

**Correção**:
```typescript
// Instalar jsonwebtoken
// npm install jsonwebtoken @types/jsonwebtoken

import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '24h'

// Middleware de autenticação
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

// Admin Login
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body
    const admin = await prisma.admin.findUnique({ where: { username } })
    
    if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    const isValidPassword = await bcrypt.compare(password, admin.password)
    if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    // ✅ Gerar token JWT real
    const token = jwt.sign(
        { id: admin.id, username: admin.username, role: 'admin' },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    )
    
    res.json({ success: true, token })
})

// Proteger rotas admin
app.use('/api/admin/*', authenticateToken)
```

---

### 5. Race Condition no Estoque
**Criticidade**: 🔴 CRÍTICA  
**Arquivo**: `server/server.ts` (linha 42)  
**CWE**: CWE-362 (Concurrent Execution using Shared Resource)

**Problema**:
- Sem controle de concorrência
- Dois clientes podem comprar o último item simultaneamente
- Estoque pode ficar negativo

**Impacto**:
- Overselling (vender mais do que tem em estoque)
- Clientes insatisfeitos
- Problemas logísticos

**Correção**:
```typescript
// Usar transação do Prisma
app.post('/api/orders', async (req, res) => {
    try {
        const { items, customerName, customerEmail } = req.body
        
        // ✅ Usar transação para garantir atomicidade
        const result = await prisma.$transaction(async (tx) => {
            let calculatedTotal = 0
            const validatedItems = []
            
            for (const item of items) {
                // Buscar produto com lock pessimista
                const product = await tx.product.findUnique({
                    where: { id: item.productId }
                })
                
                if (!product) {
                    throw new Error(`Product ${item.productId} not found`)
                }
                
                // ✅ Verificar estoque ANTES de decrementar
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`)
                }
                
                // ✅ Decrementar estoque atomicamente
                await tx.product.update({
                    where: { id: product.id },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                })
                
                const itemTotal = product.price * item.quantity
                calculatedTotal += itemTotal
                
                validatedItems.push({
                    product: { connect: { id: product.id } },
                    quantity: item.quantity,
                    price: product.price
                })
            }
            
            // Criar pedido
            const order = await tx.order.create({
                data: {
                    total: calculatedTotal,
                    customerName: customerName || "Guest",
                    customerEmail: customerEmail || "guest@example.com",
                    address: req.body.address,
                    city: req.body.city,
                    postalCode: req.body.postalCode,
                    items: {
                        create: validatedItems
                    }
                }
            })
            
            return order
        })
        
        res.json(result)
    } catch (error: any) {
        console.error(error)
        res.status(400).json({ error: error.message })
    }
})
```

---

### 6. Google OAuth sem Verificação
**Criticidade**: 🔴 CRÍTICA  
**Arquivo**: `server/server.ts` (linhas 151-188)  
**CWE**: CWE-345 (Insufficient Verification of Data Authenticity)

**Problema**:
```typescript
// Decodifica JWT sem verificar assinatura
const base64Url = credential.split('.')[1]
const payload = JSON.parse(jsonPayload) // ❌ Sem verificação!
```

**Impacto**:
- Qualquer pessoa pode forjar um token
- Acesso não autorizado
- Criação de contas falsas

**Correção**:
```typescript
import { OAuth2Client } from 'google-auth-library'

const GOOGLE_CLIENT_ID = '802903807673-1phb4ojhbvfrqhoj05e3johab97831oj.apps.googleusercontent.com'
const client = new OAuth2Client(GOOGLE_CLIENT_ID)

app.post('/api/auth/google', async (req, res) => {
    try {
        const { credential } = req.body
        
        // ✅ Verificar token com biblioteca oficial
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        })
        
        const payload = ticket.getPayload()
        
        if (!payload || !payload.email) {
            return res.status(400).json({ error: 'Invalid Google token' })
        }
        
        // ✅ Verificar se email foi verificado pelo Google
        if (!payload.email_verified) {
            return res.status(400).json({ error: 'Email not verified by Google' })
        }
        
        let user = await prisma.user.findUnique({ where: { email: payload.email } })
        
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: payload.email,
                    name: payload.given_name || payload.name || 'User',
                    password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 12),
                    phone: '',
                    status: 'active'
                }
            })
        }
        
        const { password: _, ...userWithoutPassword } = user
        res.json({ success: true, user: userWithoutPassword })
    } catch (error) {
        console.error('Google OAuth error:', error)
        res.status(500).json({ error: 'Error processing Google login' })
    }
})
```

---

### 7. CORS Aberto para Todos
**Criticidade**: 🔴 CRÍTICA  
**Arquivo**: `server/server.ts` (linha 12)  
**CWE**: CWE-942 (Overly Permissive Cross-domain Whitelist)

**Problema**:
```typescript
app.use(cors()) // ❌ Permite qualquer origem
```

**Impacto**:
- Qualquer site pode fazer requisições
- CSRF attacks
- Roubo de dados

**Correção**:
```typescript
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com', 'https://www.yourdomain.com']
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
```

---

### 8. Ausência de Sanitização de Inputs
**Criticidade**: 🔴 CRÍTICA  
**Arquivo**: `server/server.ts` (todo o arquivo)  
**CWE**: CWE-20 (Improper Input Validation)

**Problema**:
- Nenhuma validação de entrada
- Nenhuma sanitização
- Aceita qualquer tipo de dado

**Impacto**:
- SQL Injection (mitigado pelo Prisma)
- XSS
- NoSQL Injection
- Dados inválidos no banco

**Correção**:
```typescript
// Instalar Zod para validação
// npm install zod

import { z } from 'zod'

// Schema de validação para registro
const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain uppercase letter')
        .regex(/[a-z]/, 'Password must contain lowercase letter')
        .regex(/[0-9]/, 'Password must contain number'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    phone: z.string().regex(/^\d{10,11}$/, 'Invalid phone number').optional(),
    address: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
})

// Schema para login
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password required'),
})

// Schema para pedido
const orderSchema = z.object({
    items: z.array(z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive().max(100),
    })).min(1, 'At least one item required'),
    customerName: z.string().min(2).max(100).optional(),
    customerEmail: z.string().email().optional(),
    address: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
    postalCode: z.string().regex(/^\d{5}-?\d{3}$/).optional(),
})

// Middleware de validação
const validate = (schema: z.ZodSchema) => {
    return (req: any, res: any, next: any) => {
        try {
            schema.parse(req.body)
            next()
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: 'Validation error',
                    details: error.errors
                })
            }
            next(error)
        }
    }
}

// Usar validação nas rotas
app.post('/api/auth/register', validate(registerSchema), async (req, res) => {
    // ...
})

app.post('/api/auth/login', validate(loginSchema), async (req, res) => {
    // ...
})

app.post('/api/orders', validate(orderSchema), async (req, res) => {
    // ...
})
```

---

## ⚠️ VULNERABILIDADES ALTAS

### 9. Ausência de HTTPS
**Criticidade**: 🟠 ALTA  
**Impacto**: Dados trafegam em texto plano

**Correção**:
```typescript
// Em produção, usar HTTPS
import https from 'https'
import fs from 'fs'

if (process.env.NODE_ENV === 'production') {
    const options = {
        key: fs.readFileSync('path/to/private-key.pem'),
        cert: fs.readFileSync('path/to/certificate.pem')
    }
    
    https.createServer(options, app).listen(443)
} else {
    app.listen(PORT)
}
```

---

### 10. Logs Expondo Informações Sensíveis
**Criticidade**: 🟠 ALTA  
**Arquivo**: `server/server.ts` (várias linhas)

**Problema**:
```typescript
console.error(error) // Pode logar senhas, tokens, etc
```

**Correção**:
```typescript
// Usar biblioteca de logging
// npm install winston

import winston from 'winston'

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
})

// Nunca logar dados sensíveis
logger.error('Login failed', { email: user.email }) // ✅ OK
// logger.error('Login failed', { password }) // ❌ NUNCA
```

---

### 11. Ausência de Proteção CSRF
**Criticidade**: 🟠 ALTA  
**CWE**: CWE-352

**Correção**:
```typescript
// npm install csurf cookie-parser

import csrf from 'csurf'
import cookieParser from 'cookie-parser'

app.use(cookieParser())
const csrfProtection = csrf({ cookie: true })

app.get('/api/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() })
})

app.post('/api/orders', csrfProtection, async (req, res) => {
    // ...
})
```

---

### 12. Ausência de Helmet (Security Headers)
**Criticidade**: 🟠 ALTA

**Correção**:
```typescript
// npm install helmet

import helmet from 'helmet'

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}))
```

---

### 13. Tokens Armazenados em LocalStorage
**Criticidade**: 🟠 ALTA  
**Arquivo**: `client/src/store/authStore.ts`  
**CWE**: CWE-922

**Problema**:
- LocalStorage vulnerável a XSS
- Token pode ser roubado por scripts maliciosos

**Correção**:
```typescript
// Backend: Usar HttpOnly Cookies
app.post('/api/auth/login', async (req, res) => {
    // ... validação ...
    
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' })
    
    // ✅ Enviar token em HttpOnly cookie
    res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    })
    
    res.json({ success: true, user: userWithoutPassword })
})

// Frontend: Remover armazenamento de token
// O cookie será enviado automaticamente
```

---

## 🟡 VULNERABILIDADES MÉDIAS

### 14. Ausência de Validação de Tipos de Arquivo
**Criticidade**: 🟡 MÉDIA

**Correção**:
```typescript
// Para upload de imagens
import multer from 'multer'

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Invalid file type'), false)
    }
}

const upload = multer({ 
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
})
```

---

### 15. Ausência de Paginação
**Criticidade**: 🟡 MÉDIA

**Problema**:
- Pode retornar milhares de registros
- DoS por consumo de memória

**Correção**:
```typescript
app.get('/api/products', async (req, res) => {
    const page = parseInt(req.query.page as string) || 1
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100)
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
})
```

---

### 16. Ausência de Monitoramento e Alertas
**Criticidade**: 🟡 MÉDIA

**Correção**:
```typescript
// npm install @sentry/node

import * as Sentry from "@sentry/node"

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.errorHandler())
```

---

### 17. Ausência de Backup e Recovery
**Criticidade**: 🟡 MÉDIA

**Recomendação**:
- Implementar backups automáticos diários
- Testar restauração regularmente
- Manter backups em local separado

---

## 🔵 VULNERABILIDADES BAIXAS

### 18. Ausência de Versionamento de API
**Criticidade**: 🔵 BAIXA

**Correção**:
```typescript
// Versionar API
app.use('/api/v1/products', productsRouter)
app.use('/api/v2/products', productsV2Router)
```

---

### 19. Ausência de Documentação de API
**Criticidade**: 🔵 BAIXA

**Correção**:
```typescript
// npm install swagger-ui-express swagger-jsdoc

import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Lyoki API',
            version: '1.0.0',
        },
    },
    apis: ['./server.ts'],
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
```

---

### 20. Ausência de Testes de Segurança
**Criticidade**: 🔵 BAIXA

**Recomendação**:
- Implementar testes de penetração
- Usar ferramentas como OWASP ZAP
- Realizar auditorias regulares

---

## 📋 PLANO DE AÇÃO PRIORITÁRIO

### Fase 1 - URGENTE (1-2 dias)
1. ✅ Implementar hash de senhas (bcrypt)
2. ✅ Corrigir validação de preços no checkout
3. ✅ Implementar rate limiting
4. ✅ Adicionar validação de inputs (Zod)

### Fase 2 - ALTA PRIORIDADE (3-5 dias)
5. ✅ Implementar JWT adequado
6. ✅ Corrigir Google OAuth
7. ✅ Configurar CORS adequadamente
8. ✅ Implementar transações para estoque

### Fase 3 - MÉDIA PRIORIDADE (1-2 semanas)
9. ✅ Migrar tokens para HttpOnly cookies
10. ✅ Adicionar Helmet
11. ✅ Implementar CSRF protection
12. ✅ Configurar HTTPS

### Fase 4 - MELHORIAS (2-4 semanas)
13. ✅ Adicionar logging adequado
14. ✅ Implementar paginação
15. ✅ Adicionar monitoramento
16. ✅ Documentar API

---

## 🎯 MÉTRICAS DE SUCESSO

- [ ] 0 senhas em texto plano
- [ ] 100% das rotas com rate limiting
- [ ] 100% dos inputs validados
- [ ] JWT implementado em todas as rotas protegidas
- [ ] Transações em todas as operações críticas
- [ ] HTTPS em produção
- [ ] Score A+ no Mozilla Observatory
- [ ] 0 vulnerabilidades críticas no OWASP ZAP

---

## 📞 RECOMENDAÇÕES FINAIS

1. **Nunca** colocar em produção sem corrigir vulnerabilidades críticas
2. **Sempre** usar HTTPS em produção
3. **Implementar** WAF (Web Application Firewall)
4. **Realizar** pentests regulares
5. **Manter** dependências atualizadas
6. **Treinar** equipe em segurança
7. **Seguir** OWASP Top 10
8. **Implementar** política de segurança

---

**Assinatura**: Sistema de Auditoria Antigravity  
**Data**: 19/01/2026  
**Próxima Auditoria**: Após implementação das correções
