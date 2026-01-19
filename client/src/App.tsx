import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AllProducts from './pages/AllProducts'
import CartPage from './pages/CartPage'
import Checkout from './pages/Checkout'
import ProductPage from './pages/ProductPage'

// Support Pages
import QuemSomos from './pages/QuemSomos'
import Contato from './pages/Contato'
import FAQ from './pages/FAQ'
import EnvioDevolucoes from './pages/EnvioDevolucoes'
import PoliticaLoja from './pages/PoliticaLoja'
import MetodosPagamento from './pages/MetodosPagamento'

// Admin
import AdminLayout from './layouts/AdminLayout'
import AdminProducts from './pages/admin/AdminProducts'
import AdminUsers from './pages/admin/AdminUsers'
import AdminTransactions from './pages/admin/AdminTransactions'
import Admin from './pages/Admin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<ProductPage />} />

        {/* Support Pages */}
        <Route path="/quem-somos" element={<QuemSomos />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/envio-devolucoes" element={<EnvioDevolucoes />} />
        <Route path="/politica-loja" element={<PoliticaLoja />} />
        <Route path="/metodos-pagamento" element={<MetodosPagamento />} />

        {/* Admin Login */}
        <Route path="/admin" element={<Admin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
        <Route path="/admin/transactions" element={<AdminLayout><AdminTransactions /></AdminLayout>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
