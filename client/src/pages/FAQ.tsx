import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Navbar from '../components/Navbar'
import Cart from '../components/Cart'
import Footer from '../components/Footer'

const faqs = [
    {
        question: "Como faço um pedido?",
        answer: "Navegue pelo nosso catálogo, escolha os produtos desejados, adicione ao carrinho e finalize a compra. Você receberá um email de confirmação com todos os detalhes do seu pedido."
    },
    {
        question: "Quais são as formas de pagamento aceitas?",
        answer: "Aceitamos pagamento via PIX, cartão de crédito (até 12x sem juros) e dinheiro (apenas para retirada na loja física)."
    },
    {
        question: "Quanto tempo demora para receber meu pedido?",
        answer: "O prazo de entrega varia de acordo com sua região. Geralmente, entregas são realizadas em 7 a 15 dias úteis após a confirmação do pagamento. Você receberá o código de rastreamento por email."
    },
    {
        question: "Como faço para rastrear meu pedido?",
        answer: "Após o envio, você receberá um email com o código de rastreamento. Você pode acompanhar sua encomenda diretamente no site dos Correios ou da transportadora."
    },
    {
        question: "Posso trocar ou devolver um produto?",
        answer: "Sim! Você tem até 7 dias após o recebimento para solicitar troca ou devolução, conforme o Código de Defesa do Consumidor. O produto deve estar sem uso, com etiquetas e na embalagem original."
    },
    {
        question: "Como funciona a política de trocas?",
        answer: "Entre em contato conosco em até 7 dias após receber o produto. Enviaremos as instruções para devolução. Após recebermos o item, processaremos a troca ou reembolso em até 10 dias úteis."
    },
    {
        question: "Os produtos têm garantia?",
        answer: "Sim! Todos os nossos produtos possuem garantia de 90 dias contra defeitos de fabricação. Caso identifique algum problema, entre em contato conosco."
    },
    {
        question: "Vocês fazem envios para todo o Brasil?",
        answer: "Sim! Realizamos entregas para todo o território nacional através dos Correios e transportadoras parceiras."
    },
    {
        question: "Como sei qual tamanho escolher?",
        answer: "Cada produto possui uma tabela de medidas detalhada na página. Recomendamos verificar suas medidas e comparar com nossa tabela antes de finalizar a compra."
    },
    {
        question: "Posso retirar meu pedido na loja?",
        answer: "Sim! Você pode escolher a opção 'Retirar na Loja' no checkout. Você receberá um email quando seu pedido estiver pronto para retirada no nosso endereço."
    },
    {
        question: "Vocês lançam coleções novas com frequência?",
        answer: "Sim! Estamos sempre criando novos drops e coleções exclusivas. Siga nossas redes sociais e inscreva-se na newsletter para não perder nenhum lançamento."
    },
    {
        question: "Como entro em contato com o suporte?",
        answer: "Você pode nos contatar por email (lyokisite@gmail.com), WhatsApp ou através do formulário na página de Contato. Respondemos em até 24 horas."
    }
]

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Cart />
            {/* Hero Section */}
            <div className="relative h-[300px] bg-black flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-lyoki-red/20 to-black/80 z-10"></div>
                <div className="relative z-20 text-center">
                    <h1 className="font-grunge text-7xl text-white mb-4">FAQ</h1>
                    <div className="w-32 h-1 bg-lyoki-red mx-auto"></div>
                    <p className="text-gray-300 mt-4 text-lg">Perguntas Frequentes</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <p className="text-xl text-gray-700">
                        Tire suas dúvidas sobre pedidos, entregas, trocas e muito mais!
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border-2 border-black overflow-hidden"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors text-left"
                            >
                                <h3 className="font-bold text-lg pr-4">{faq.question}</h3>
                                <div className="flex-shrink-0">
                                    {openIndex === index ? (
                                        <ChevronUp className="text-lyoki-red" size={24} />
                                    ) : (
                                        <ChevronDown className="text-lyoki-red" size={24} />
                                    )}
                                </div>
                            </button>

                            {openIndex === index && (
                                <div className="bg-gray-100 p-6 border-t-2 border-black">
                                    <p className="text-gray-700 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-16 bg-black text-white p-8 border-4 border-lyoki-red text-center">
                    <h2 className="font-grunge text-3xl mb-4">NÃO ENCONTROU SUA RESPOSTA?</h2>
                    <p className="text-gray-300 mb-6">
                        Entre em contato conosco! Estamos aqui para ajudar.
                    </p>
                    <a
                        href="/contato"
                        className="inline-block bg-lyoki-red hover:bg-white hover:text-black text-white px-8 py-3 font-bold uppercase transition-colors border-2 border-transparent hover:border-black"
                    >
                        Falar com Suporte
                    </a>
                </div>
            </div>

            <Footer />
        </div>
    )
}
