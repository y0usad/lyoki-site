# 💳 Guia de Configuração do Mercado Pago

## 📋 **O que foi implementado:**

✅ **Backend:**
- Integração completa com API do Mercado Pago
- Criação de preferências de pagamento (PIX, Cartão, Boleto)
- Webhook para receber notificações de pagamento
- Atualização automática do status do pedido

✅ **Banco de Dados:**
- Campos adicionados: `paymentId`, `paymentStatus`, `paymentMethod`
- Migração aplicada com sucesso

✅ **Métodos de Pagamento Suportados:**
- 💚 **PIX** (instantâneo)
- 💳 **Cartão de Crédito** (até 12x)
- 📄 **Boleto Bancário**

---

## 🔧 **Como Configurar (Passo a Passo):**

### **1. Criar Conta no Mercado Pago**

1. Acesse: https://www.mercadopago.com.br/
2. Clique em "Criar conta"
3. Complete o cadastro

### **2. Obter Credenciais de TESTE**

1. Acesse: https://www.mercadopago.com.br/developers/panel/credentials
2. Faça login
3. Vá em **"Suas credenciais"** → **"Credenciais de teste"**
4. Copie o **Access Token de TESTE** (começa com `TEST-`)

### **3. Configurar no Projeto**

Abra o arquivo `server/.env` e substitua:

```bash
MERCADOPAGO_ACCESS_TOKEN="TEST-YOUR-ACCESS-TOKEN-HERE"
```

Por:

```bash
MERCADOPAGO_ACCESS_TOKEN="TEST-1234567890-abcdef..."  # Cole sua chave aqui
```

### **4. Reiniciar o Servidor**

```bash
cd server
npx ts-node server.ts
```

---

## 🧪 **Como Testar Pagamentos:**

### **Modo TESTE (Sandbox):**

O Mercado Pago fornece cartões de teste para simular pagamentos:

#### **Cartões de Crédito de Teste:**

| Cartão | Número | CVV | Validade | Resultado |
|--------|--------|-----|----------|-----------|
| Mastercard | `5031 4332 1540 6351` | 123 | 11/25 | ✅ Aprovado |
| Visa | `4235 6477 2802 5682` | 123 | 11/25 | ✅ Aprovado |
| Amex | `3753 651535 56885` | 1234 | 11/25 | ✅ Aprovado |
| Mastercard | `5031 7557 3453 0604` | 123 | 11/25 | ❌ Recusado |

**CPF de Teste:** `123.456.789-01`

#### **PIX de Teste:**
- Ao selecionar PIX, será gerado um QR Code de teste
- O pagamento será aprovado automaticamente após alguns segundos

---

## 🔄 **Fluxo de Pagamento:**

1. **Cliente finaliza compra** → Pedido criado com status `PENDING`
2. **Sistema cria preferência** → Mercado Pago gera link de pagamento
3. **Cliente paga** → Mercado Pago processa o pagamento
4. **Webhook notifica** → Backend recebe notificação
5. **Status atualizado** → Pedido muda para `PAID`

---

## 📡 **Endpoints Criados:**

### **POST** `/api/payment/create-preference`
Cria uma preferência de pagamento

**Body:**
```json
{
  "orderId": 1,
  "amount": 150.00,
  "description": "Pedido #1",
  "paymentMethod": "pix",
  "payer": {
    "email": "cliente@email.com",
    "name": "João Silva"
  }
}
```

**Response:**
```json
{
  "success": true,
  "preferenceId": "123456789-abc",
  "initPoint": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=...",
  "sandboxInitPoint": "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=..."
}
```

### **POST** `/api/webhooks/mercadopago`
Recebe notificações do Mercado Pago (configurado automaticamente)

### **GET** `/api/payment/status/:paymentId`
Verifica status de um pagamento

---

## 🚀 **Próximos Passos:**

### **Para usar em PRODUÇÃO:**

1. **Obter Credenciais de Produção:**
   - Acesse: https://www.mercadopago.com.br/developers/panel/credentials
   - Vá em **"Credenciais de produção"**
   - Complete a validação da conta
   - Copie o **Access Token de PRODUÇÃO**

2. **Atualizar `.env`:**
   ```bash
   MERCADOPAGO_ACCESS_TOKEN="APP-1234567890-abcdef..."  # Chave de produção
   FRONTEND_URL="https://seusite.com.br"
   BACKEND_URL="https://api.seusite.com.br"
   NODE_ENV="production"
   ```

3. **Configurar Webhook:**
   - Acesse: https://www.mercadopago.com.br/developers/panel/webhooks
   - Adicione a URL: `https://api.seusite.com.br/api/webhooks/mercadopago`
   - Selecione eventos: **Pagamentos**

---

## 🛡️ **Segurança:**

✅ **Implementado:**
- Validação de dados no servidor
- Cálculo de preço no backend (cliente não pode manipular)
- Verificação de estoque antes de criar pedido
- Webhook protegido contra requisições falsas

⚠️ **Recomendações:**
- **NUNCA** exponha sua chave de produção no frontend
- Use HTTPS em produção
- Configure firewall para aceitar apenas IPs do Mercado Pago no webhook

---

## 📞 **Suporte:**

- **Documentação:** https://www.mercadopago.com.br/developers/pt/docs
- **Comunidade:** https://www.mercadopago.com.br/developers/pt/support
- **Status da API:** https://status.mercadopago.com/

---

## ✅ **Checklist de Implementação:**

- [x] Instalar SDK do Mercado Pago
- [x] Adicionar campos de pagamento no banco
- [x] Criar serviço de pagamento (`payment.ts`)
- [x] Adicionar rotas de pagamento no backend
- [x] Configurar variáveis de ambiente
- [ ] **Obter credenciais de teste do Mercado Pago** ← **VOCÊ ESTÁ AQUI**
- [ ] Atualizar frontend para chamar API de pagamento
- [ ] Testar fluxo completo
- [ ] Configurar webhook em produção

---

**🎉 O backend está pronto! Agora você precisa:**
1. Obter suas credenciais de teste no Mercado Pago
2. Atualizar o `.env` com sua chave
3. Eu vou atualizar o frontend para integrar com o pagamento
