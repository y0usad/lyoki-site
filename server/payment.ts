import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'

// ⚠️ IMPORTANTE: Substitua pela sua chave de acesso do Mercado Pago
// Para testes, use a chave de TESTE (começa com TEST-)
// Para produção, use a chave de PRODUÇÃO
const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-YOUR-ACCESS-TOKEN-HERE'

const client = new MercadoPagoConfig({
    accessToken: ACCESS_TOKEN,
    options: { timeout: 5000 }
})

const payment = new Payment(client)
const preference = new Preference(client)

export interface PaymentData {
    orderId: number
    amount: number
    description: string
    paymentMethod: 'pix' | 'credit_card' | 'boleto'
    payer: {
        email: string
        name: string
    }
}

/**
 * Cria uma preferência de pagamento no Mercado Pago
 * Retorna o link de pagamento para o cliente
 */
export async function createPaymentPreference(data: PaymentData) {
    try {
        const preferenceData = {
            items: [
                {
                    id: `order-${data.orderId}`,
                    title: data.description,
                    quantity: 1,
                    unit_price: data.amount,
                    currency_id: 'BRL'
                }
            ],
            payer: {
                email: data.payer.email,
                name: data.payer.name
            },
            payment_methods: {
                excluded_payment_types: [],
                installments: 12 // Até 12x
            },
            back_urls: {
                success: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success`,
                failure: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failure`,
                pending: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/pending`
            },
            auto_return: 'approved' as const,
            external_reference: `order-${data.orderId}`,
            notification_url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/webhooks/mercadopago`
        }

        const result = await preference.create({ body: preferenceData })

        return {
            success: true,
            preferenceId: result.id,
            initPoint: result.init_point, // Link de pagamento
            sandboxInitPoint: result.sandbox_init_point // Link de teste
        }
    } catch (error: any) {
        console.error('Erro ao criar preferência de pagamento:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

/**
 * Verifica o status de um pagamento
 */
export async function getPaymentStatus(paymentId: string) {
    try {
        const result = await payment.get({ id: paymentId })
        return {
            success: true,
            status: result.status, // approved, pending, rejected
            statusDetail: result.status_detail,
            amount: result.transaction_amount,
            paymentMethod: result.payment_method_id
        }
    } catch (error: any) {
        console.error('Erro ao buscar status do pagamento:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

export { payment, preference }
