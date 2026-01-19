# 🔐 GUIA DE IMPLEMENTAÇÃO DE SEGURANÇA
## Passo a Passo para Corrigir Vulnerabilidades

---

## 📋 PRÉ-REQUISITOS

- Node.js 18+
- npm ou yarn
- Acesso ao banco de dados
- Backup do banco de dados atual

---

## 🚀 FASE 1: INSTALAÇÃO DE DEPENDÊNCIAS (30 minutos)

### Passo 1.1: Instalar Dependências de Segurança

```bash
cd server

# Instalar todas as dependências de segurança
npm install bcrypt @types/bcrypt
npm install jsonwebtoken @types/jsonwebtoken
npm install express-rate-limit
npm install helmet
npm install zod
npm install google-auth-library

# Verificar instalação
npm list | grep -E "bcrypt|jsonwebtoken|rate-limit|helmet|zod|google-auth"
```

### Passo 1.2: Criar Arquivo .env

```bash
# Criar arquivo .env na raiz do servidor
touch .env
```

Adicionar ao `.env`:
```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# JWT Secret (GERAR UM NOVO!)
JWT_SECRET="sua-chave-secreta-muito-longa-e-aleatoria-aqui-minimo-32-caracteres"

# Google OAuth
GOOGLE_CLIENT_ID="802903807673-1phb4ojhbvfrqhoj05e3johab97831oj.apps.googleusercontent.com"

# Environment
NODE_ENV="development"
PORT=3000
```

**⚠️ IMPORTANTE**: Gerar JWT_SECRET seguro:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🔒 FASE 2: MIGRAÇÃO DO BANCO DE DADOS (1 hora)

### Passo 2.1: Backup do Banco Atual

```bash
# Fazer backup do banco de dados
cp prisma/dev.db prisma/dev.db.backup.$(date +%Y%m%d_%H%M%S)
```

### Passo 2.2: Atualizar Schema do Prisma

O schema já está correto com o campo `password` no modelo `User`.

### Passo 2.3: Migrar Senhas Existentes

Criar script de migração `prisma/migrate-passwords.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function migratePasswords() {
    console.log('🔄 Starting password migration...')
    
    // Buscar todos os usuários
    const users = await prisma.user.findMany()
    
    console.log(`📊 Found ${users.length} users to migrate`)
    
    for (const user of users) {
        // Verificar se a senha já está hasheada (começa com $2b$)
        if (user.password.startsWith('$2b$')) {
            console.log(`✅ User ${user.email} already has hashed password`)
            continue
        }
        
        // Hash da senha em texto plano
        const hashedPassword = await bcrypt.hash(user.password, 12)
        
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        })
        
        console.log(`✅ Migrated password for user: ${user.email}`)
    }
    
    // Migrar admin
    const admins = await prisma.admin.findMany()
    
    for (const admin of admins) {
        if (admin.password.startsWith('$2b$')) {
            console.log(`✅ Admin ${admin.username} already has hashed password`)
            continue
        }
        
        const hashedPassword = await bcrypt.hash(admin.password, 12)
        
        await prisma.admin.update({
            where: { id: admin.id },
            data: { password: hashedPassword }
        })
        
        console.log(`✅ Migrated password for admin: ${admin.username}`)
    }
    
    console.log('✅ Password migration completed!')
}

migratePasswords()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
```

Executar migração:
```bash
npx ts-node prisma/migrate-passwords.ts
```

---

## 🔧 FASE 3: SUBSTITUIR SERVIDOR (30 minutos)

### Passo 3.1: Testar Servidor Seguro

```bash
# Renomear servidor atual
mv server.ts server.OLD.ts

# Copiar servidor seguro
cp server.SECURE.ts server.ts

# Testar
npm run dev
```

### Passo 3.2: Verificar Logs

Você deve ver:
```
✅ Server running on http://localhost:3000
🔒 Security features enabled:
   - Rate limiting
   - Input validation
   - Password hashing
   - JWT authentication
   - CORS protection
   - Helmet security headers
```

---

## 🧪 FASE 4: TESTES (2 horas)

### Passo 4.1: Testar Registro

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "name": "Test User",
    "phone": "11999999999"
  }'
```

**Esperado**: Retornar token JWT e dados do usuário.

### Passo 4.2: Testar Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

**Esperado**: Retornar token JWT.

### Passo 4.3: Testar Rate Limiting

```bash
# Executar 6 vezes rapidamente
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
  echo ""
done
```

**Esperado**: 6ª requisição deve retornar erro 429 (Too Many Requests).

### Passo 4.4: Testar Validação de Preços

```bash
# Tentar criar pedido com preço manipulado
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"productId": 1, "quantity": 1}
    ],
    "customerEmail": "test@test.com"
  }'
```

**Esperado**: Preço deve ser calculado no servidor, não aceitar do cliente.

### Passo 4.5: Testar Proteção Admin

```bash
# Tentar acessar rota admin sem token
curl http://localhost:3000/api/admin/users
```

**Esperado**: Erro 401 (Unauthorized).

```bash
# Fazer login admin e usar token
TOKEN=$(curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' \
  | jq -r '.token')

# Acessar com token
curl http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer $TOKEN"
```

**Esperado**: Retornar lista de usuários.

---

## 📱 FASE 5: ATUALIZAR FRONTEND (1 hora)

### Passo 5.1: Atualizar authStore para usar JWT

```typescript
// client/src/store/authStore.ts

login: async (email: string, password: string) => {
    const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })

    const data = await response.json()
    
    // ✅ Salvar token
    localStorage.setItem('authToken', data.token)
    
    set({ user: data.user, isAuthenticated: true })
    return true
}
```

### Passo 5.2: Adicionar Interceptor para JWT

```typescript
// client/src/api.ts

import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
})

// ✅ Adicionar token em todas as requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api
```

---

## 🔍 FASE 6: VALIDAÇÃO FINAL (1 hora)

### Checklist de Segurança

- [ ] Senhas hasheadas com bcrypt
- [ ] JWT implementado e funcionando
- [ ] Rate limiting ativo
- [ ] Validação de inputs com Zod
- [ ] Preços validados no servidor
- [ ] Transações para estoque
- [ ] CORS configurado
- [ ] Helmet ativo
- [ ] Google OAuth verificado
- [ ] Rotas admin protegidas
- [ ] Logs não expõem dados sensíveis
- [ ] .env não está no git
- [ ] Backup do banco feito

### Testes de Penetração Básicos

```bash
# 1. Tentar SQL Injection
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com OR 1=1--","password":"test"}'
# Esperado: Erro de validação

# 2. Tentar XSS
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123","name":"<script>alert(1)</script>"}'
# Esperado: Dados sanitizados

# 3. Tentar manipular preço
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":1,"quantity":1,"price":0.01}]}'
# Esperado: Preço do servidor usado
```

---

## 🚨 ROLLBACK (Se necessário)

Se algo der errado:

```bash
# 1. Parar servidor
# Ctrl+C

# 2. Restaurar servidor antigo
mv server.ts server.FAILED.ts
mv server.OLD.ts server.ts

# 3. Restaurar banco de dados
cp prisma/dev.db.backup.YYYYMMDD_HHMMSS prisma/dev.db

# 4. Reiniciar
npm run dev
```

---

## 📊 MONITORAMENTO PÓS-DEPLOY

### Métricas para Monitorar

1. **Taxa de Erro de Login**
   - Normal: < 5%
   - Alerta: > 10%
   - Crítico: > 20%

2. **Requisições Bloqueadas por Rate Limit**
   - Normal: < 1%
   - Alerta: > 5%

3. **Tempo de Resposta**
   - Normal: < 200ms
   - Alerta: > 500ms
   - Crítico: > 1000ms

4. **Erros de Validação**
   - Monitorar padrões suspeitos

### Logs para Revisar Diariamente

```bash
# Ver tentativas de login falhadas
grep "Invalid credentials" logs/combined.log | tail -50

# Ver rate limit hits
grep "Too many" logs/combined.log | tail -50

# Ver erros de validação
grep "Validation error" logs/combined.log | tail -50
```

---

## 🎯 PRÓXIMOS PASSOS

### Curto Prazo (1 semana)
- [ ] Implementar logging com Winston
- [ ] Adicionar monitoramento com Sentry
- [ ] Configurar HTTPS
- [ ] Implementar CSRF protection

### Médio Prazo (1 mês)
- [ ] Migrar tokens para HttpOnly cookies
- [ ] Implementar refresh tokens
- [ ] Adicionar 2FA
- [ ] Penetration testing profissional

### Longo Prazo (3 meses)
- [ ] WAF (Web Application Firewall)
- [ ] DDoS protection
- [ ] Compliance LGPD/GDPR
- [ ] Auditoria de segurança externa

---

## 📞 SUPORTE

Se encontrar problemas:

1. Verificar logs do servidor
2. Verificar .env está configurado
3. Verificar todas as dependências instaladas
4. Consultar SECURITY_AUDIT_REPORT.md
5. Fazer rollback se necessário

---

**Última Atualização**: 19/01/2026  
**Versão**: 2.0.0-secure  
**Status**: Pronto para implementação
