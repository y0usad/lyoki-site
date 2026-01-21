import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Home from './pages/Home'
import AllProducts from './pages/AllProducts'
import CartPage from './pages/CartPage'
import Checkout from './pages/Checkout'
import ProductPage from './pages/ProductPage'
import Login from './pages/Login'
import Account from './pages/Account'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailure from './pages/PaymentFailure'
import PaymentPending from './pages/PaymentPending'

// Support Pages
import QuemSomos from './pages/QuemSomos'
import Contato from './pages/Contato'
import FAQ from './pages/FAQ'
import EnvioDevolucoes from './pages/EnvioDevolucoes'
import PoliticaLoja from './pages/PoliticaLoja'
import MetodosPagamento from './pages/MetodosPagamento'

// Admin
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminUsers from './pages/admin/AdminUsers'
import AdminTransactions from './pages/admin/AdminTransactions'
import AdminAdmins from './pages/admin/AdminAdmins'
import Admin from './pages/Admin'
import ProtectedRoute from './components/ProtectedRoute'

const GOOGLE_CLIENT_ID = '802903807673-1phb4ojhbvfrqhoj05e3johab97831oj.apps.googleusercontent.com'

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />

          {/* Payment Return Pages */}
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failure" element={<PaymentFailure />} />
          <Route path="/payment/pending" element={<PaymentPending />} />

          {/* Support Pages */}
          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/envio-devolucoes" element={<EnvioDevolucoes />} />
          <Route path="/politica-loja" element={<PoliticaLoja />} />
          <Route path="/metodos-pagamento" element={<MetodosPagamento />} />

          {/* Admin Login (SEM proteção) */}
          <Route path="/admin/login" element={<Admin />} />

          {/* Protected Admin Routes (COM proteção) */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute>
              <AdminLayout><AdminProducts /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <AdminLayout><AdminUsers /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/transactions" element={
            <ProtectedRoute>
              <AdminLayout><AdminTransactions /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/admins" element={
            <ProtectedRoute>
              <AdminLayout><AdminAdmins /></AdminLayout>
            </ProtectedRoute>
          } />

        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App
