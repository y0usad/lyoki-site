# 🚀 INSTRUÇÕES RÁPIDAS - Aplicar Correções

## ⚠️ IMPORTANTE: Siga esta ordem!

### 1️⃣ PARE O SERVIDOR
```bash
# Pressione Ctrl+C no terminal onde o servidor está rodando
```

### 2️⃣ APLIQUE A MIGRAÇÃO DO BANCO
```bash
cd server
npx prisma migrate dev --name add_user_profile_fields
npx prisma generate
```

### 3️⃣ REINICIE O SERVIDOR
```bash
# No terminal do servidor:
npm run dev
```

### 4️⃣ REINICIE O FRONTEND (se necessário)
```bash
# No terminal do cliente:
cd client
npm run dev
```

---

## ✅ O QUE FOI CORRIGIDO

### Problema 1: Dados não salvavam após F5
**✅ RESOLVIDO** - Agora todos os campos são salvos no banco de dados

### Problema 2: Falta de sincronização com Admin Dashboard  
**✅ RESOLVIDO** - Todos os dados do usuário agora aparecem no admin

---

## 📊 NOVOS CAMPOS DISPONÍVEIS

- ✅ Sobrenome (lastName)
- ✅ CPF/CNPJ (cpf)
- ✅ Endereço completo:
  - Rua (street)
  - Número (number)
  - Cidade (city)
  - Estado (state)
  - CEP (zipCode)
  - País (country)

---

## 🧪 COMO TESTAR

1. Faça login no site
2. Vá para "Minha Conta"
3. Clique em "EDITAR"
4. Preencha TODOS os campos
5. Clique em "Salvar"
6. **Dê F5 (reload da página)**
7. ✅ Verifique que os dados continuam lá!

---

## 📱 ADMIN DASHBOARD

Os dados agora aparecem automaticamente no painel admin em:
- `/api/admin/users` - Lista todos os usuários com campos completos

---

## 🆘 PROBLEMAS?

Se algo não funcionar:

1. Certifique-se de que parou o servidor antes da migração
2. Verifique se não há erros no console
3. Limpe o cache do navegador (Ctrl+Shift+Delete)
4. Faça logout e login novamente

---

## 📚 DOCUMENTAÇÃO COMPLETA

Veja os arquivos:
- `USER_DATA_PERSISTENCE_FIX.md` - Explicação técnica completa
- `USER_PROFILE_UPDATE_FIX.md` - Correção do JWT token
