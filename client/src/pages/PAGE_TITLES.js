// Script para adicionar usePageTitle em todas as páginas
// Este arquivo documenta as páginas que precisam do hook

const pagesToUpdate = [
    { file: 'Account.tsx', title: 'LYOKI - Minha Conta' },
    { file: 'Login.tsx', title: 'LYOKI - Login' },
    { file: 'AllProducts.tsx', title: 'LYOKI - Produtos' },
    { file: 'CartPage.tsx', title: 'LYOKI - Carrinho' },
    { file: 'Checkout.tsx', title: 'LYOKI - Checkout' },
    { file: 'ProductPage.tsx', title: 'LYOKI - Produto' },
    { file: 'QuemSomos.tsx', title: 'LYOKI - Quem Somos' },
    { file: 'FAQ.tsx', title: 'LYOKI - FAQ' },
    { file: 'EnvioDevolucoes.tsx', title: 'LYOKI - Envio e Devoluções' },
    { file: 'PoliticaLoja.tsx', title: 'LYOKI - Política da Loja' },
    { file: 'MetodosPagamento.tsx', title: 'LYOKI - Métodos de Pagamento' },
    { file: 'admin/AdminTransactions.tsx', title: 'LYOKI Admin - Transações' },
    { file: 'admin/AdminAdmins.tsx', title: 'LYOKI Admin - Administradores' },
];

// Instruções:
// 1. Importar: import { usePageTitle } from '../hooks/usePageTitle'
// 2. Adicionar no início do componente: usePageTitle('TÍTULO')
