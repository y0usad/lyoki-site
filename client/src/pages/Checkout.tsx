import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { usePageTitle } from "../hooks/usePageTitle";
import { createOrder, createPaymentPreference } from "../api";
import Navbar from "../components/Navbar";
import Cart from "../components/Cart";
import Footer from "../components/Footer";
import { Tag, FileText } from "lucide-react";

export default function Checkout() {
  usePageTitle('LYOKI > CHECKOUT');
  const { cart, total, clearCart } = useCartStore();
  const { user, isAuthenticated, addOrder } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("PAC2");
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("pix");

  const shippingOptions = [
    {
      id: "PAC2",
      name: "PAC 2",
      price: 20.0,
      days: "3 - 7 dias úteis a partir da postagem",
    },
    {
      id: "PAC_NORTE",
      name: "PAC NORTE/NORDESTE",
      price: 55.0,
      days: "5 - 11 dias úteis a partir da postagem",
    },
    {
      id: "SEDEX2",
      name: "SEDEX 2",
      price: 55.0,
      days: "1 - 3 dias úteis a partir da postagem",
    },
    {
      id: "SEDEX_NORTE",
      name: "SEDEX NORTE/NORDESTE",
      price: 70.0,
      days: "2 - 6 dias úteis a partir da postagem",
    },
    {
      id: "RETIRADA",
      name: "Retirada no Estúdio",
      price: 0,
      days: "Gratuito",
      location:
        "Rua Henrique Correia, 1909 - Bairro Alto, Curitiba - PR, 82840-270, Brasil",
    },
  ];

  const [formData, setFormData] = useState({
    email: user?.email || "",
    name: user?.name || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    cpf: user?.cpf || "",
    country: user?.address?.country || "Brasil",
    street: user?.address?.street || "",
    number: user?.address?.number || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
  });

  // Update form when user logs in
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        phone: user.phone,
        cpf: user.cpf || "",
        country: user.address?.country || "Brasil",
        street: user.address?.street || "",
        number: user.address?.number || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zipCode: user.address?.zipCode || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShippingChange = (methodId: string) => {
    setShippingMethod(methodId);
    const method = shippingOptions.find((m) => m.id === methodId);
    setShippingCost(method?.price || 0);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Criar pedido no backend
      const orderData = {
        items: cart.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
          price: i.price,
        })),
        total: total() + shippingCost,
        customerName: `${formData.name} ${formData.lastName}`,
        customerEmail: formData.email,
        address: `${formData.street}, ${formData.number}`,
        city: formData.city,
        postalCode: formData.zipCode,
      };

      const order = await createOrder(orderData);

      // 2. Criar preferência de pagamento no Mercado Pago
      const paymentData = {
        orderId: order.id,
        amount: total() + shippingCost,
        description: `Pedido #${order.id} - ${cart.length} item(ns)`,
        paymentMethod: paymentMethod,
        payer: {
          email: formData.email,
          name: `${formData.name} ${formData.lastName}`,
        },
      };

      const paymentResult = await createPaymentPreference(paymentData);

      if (paymentResult.success) {
        // Add to user's order history if logged in
        if (isAuthenticated) {
          const newOrder = {
            id: order.id,
            date: new Date().toISOString(),
            items: cart,
            total: total() + shippingCost,
            status: "processing" as const,
            shippingMethod:
              shippingOptions.find((m) => m.id === shippingMethod)?.name || "",
            shippingCost: shippingCost,
          };
          addOrder(newOrder);
        }

        clearCart();

        // 3. Redirecionar para o Mercado Pago
        // Em produção, use initPoint. Em teste, use sandboxInitPoint
        const checkoutUrl = paymentResult.sandboxInitPoint || paymentResult.initPoint;
        window.location.href = checkoutUrl;
      } else {
        throw new Error(paymentResult.error || "Erro ao criar pagamento");
      }
    } catch (e: any) {
      alert(`❌ Erro ao processar pedido: ${e.message || "Tente novamente."}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <Cart />
        <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans">
          <h1 className="text-4xl font-bold mb-6 font-grunge text-center">
            SEU CARRINHO ESTÁ VAZIO
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Adicione produtos para continuar
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-12 py-4 uppercase font-bold hover:bg-lyoki-red transition-colors border-4 border-black hover:border-lyoki-red shadow-[8px_8px_0px_0px_#DC143C]"
          >
            Voltar para Loja
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Cart />

      {/* Hero Section */}
      <div className="bg-black text-white py-12 border-b-4 border-lyoki-red">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-grunge text-6xl mb-2">CHECKOUT</h1>
          <p className="text-gray-400 text-lg">Finalize seu pedido</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#DC143C]">
              <h2 className="font-grunge text-3xl mb-2 text-black">
                CHECKOUT SEGURO
              </h2>
              <Link
                to="/"
                className="text-sm text-gray-600 hover:text-lyoki-red underline mb-6 inline-block"
              >
                Continuar navegando
              </Link>

              {/* Payment Method Selection */}
              <div className="mb-8 pb-8 border-b-2 border-gray-300">
                <h3 className="font-bold text-lg uppercase mb-4">
                  Método de Pagamento
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 bg-white border-2 border-black cursor-pointer hover:border-lyoki-red transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="pix"
                      checked={paymentMethod === "pix"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-sm">💚 PIX</div>
                      <p className="text-xs text-gray-600">Aprovação instantânea</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-white border-2 border-black cursor-pointer hover:border-lyoki-red transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={paymentMethod === "credit_card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-sm">💳 Cartão de Crédito</div>
                      <p className="text-xs text-gray-600">Parcele em até 12x</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-white border-2 border-black cursor-pointer hover:border-lyoki-red transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="boleto"
                      checked={paymentMethod === "boleto"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-sm">📄 Boleto Bancário</div>
                      <p className="text-xs text-gray-600">Vencimento em 3 dias úteis</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Login Prompt */}
              {!isAuthenticated && (
                <div className="mb-6 bg-gray-50 p-4 border-2 border-gray-300">
                  <p className="text-sm">
                    Tem uma conta?{" "}
                    <Link
                      to="/login"
                      className="text-lyoki-red font-bold hover:underline"
                    >
                      Faça login
                    </Link>
                  </p>
                </div>
              )}

              {isAuthenticated && (
                <div className="mb-6 bg-green-50 p-4 border-2 border-green-600">
                  <p className="text-sm font-semibold text-green-800">
                    ✓ Logado como {user?.email} |{" "}
                    <Link
                      to="/account"
                      className="text-lyoki-red hover:underline"
                    >
                      Ver perfil
                    </Link>
                  </p>
                </div>
              )}

              <form onSubmit={handlePayment} className="space-y-8">
                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg uppercase">
                    Informações do cliente
                  </h3>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Email *
                    </label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border-2 border-black p-3 outline-none focus:border-lyoki-red transition-colors"
                      placeholder="examplo@gmail.com"
                      type="email"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Nome *
                      </label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border-2 border-black p-3 outline-none focus:border-lyoki-red transition-colors"
                        placeholder="Nome"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Sobrenome *
                      </label>
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full border-2 border-black p-3 outline-none focus:border-lyoki-red transition-colors"
                        placeholder="Sobrenome"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      CPF/CNPJ *
                    </label>
                    <input
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      className="w-full border-2 border-black p-3 outline-none focus:border-lyoki-red transition-colors"
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Telefone *
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border-2 border-black p-3 outline-none focus:border-lyoki-red transition-colors"
                      placeholder="41-99999-9999"
                      type="tel"
                      required
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg uppercase">
                    Detalhes da entrega
                  </h3>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      País/região *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full border-2 border-black p-3 outline-none focus:border-lyoki-red transition-colors"
                      required
                    >
                      <option value="Brasil">Brasil</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold mb-2">
                        Endereço *
                      </label>
                      <input
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        className="w-full border-2 border-black p-3 outline-none focus:border-lyoki-red transition-colors"
                        placeholder="Rua de Exemplo, 000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Número *
                      </label>
                      <input
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        className="w-full border-2 border-black p-3 outline-none focus:border-lyoki-red transition-colors"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Cidade *
                      </label>
                      <input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full border-2 border-black p-3 outline-none focus:border-lyoki-red transition-colors"
                        placeholder="Cidade"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Estado *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full border-2 border-black p-3 outline-none focus:border-lyoki-red transition-colors"
                        required
                      >
                        <option value="">Selecione...</option>
                        <option value="Paraná">Paraná</option>
                        <option value="São Paulo">São Paulo</option>
                        <option value="Rio de Janeiro">Rio de Janeiro</option>
                        <option value="Minas Gerais">Minas Gerais</option>
                        <option value="Bahia">Bahia</option>
                        {/* Add more states as needed */}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Código postal (CEP) *
                    </label>
                    <input
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full border-2 border-black p-3 outline-none focus:border-lyoki-red transition-colors"
                      placeholder="00000-000"
                      required
                    />
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg uppercase">
                    Método de entrega
                  </h3>
                  <div className="bg-gray-50 p-4 border-2 border-gray-300">
                    <p className="text-sm font-semibold mb-3">
                      Frete e entrega
                    </p>
                    <div className="space-y-2">
                      {shippingOptions.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-start gap-3 p-3 bg-white border-2 border-gray-300 cursor-pointer hover:border-lyoki-red transition-colors"
                        >
                          <input
                            type="radio"
                            name="shipping"
                            value={option.id}
                            checked={shippingMethod === option.id}
                            onChange={() => handleShippingChange(option.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-sm">
                                {option.name}
                              </span>
                              <span className="font-bold">
                                R$ {option.price.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              {option.days}
                            </p>
                            {option.location && (
                              <p className="text-xs text-gray-500 mt-1">
                                {option.location}
                              </p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Billing Address
                <div className="space-y-4">
                  <h3 className="font-bold text-lg uppercase">
                    Endereço de faturamento
                  </h3> */}

                {/* <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Nome *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        className="w-full border-2 border-black p-3 outline-none bg-gray-100"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Sobrenome *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        className="w-full border-2 border-black p-3 outline-none bg-gray-100"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      className="w-full border-2 border-black p-3 outline-none bg-gray-100"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      CPF/CNPJ *
                    </label>
                    <input
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      className="w-full border-2 border-black p-3 outline-none focus:border-lyoki-red transition-colors"
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div> */}

                {/* Payment Section */}
                {/* <div className="space-y-4">
                  <h3 className="font-bold text-lg uppercase">Pagamento</h3>
                  <div className="bg-gray-50 p-4 border-2 border-gray-300">
                    <p className="text-sm text-gray-600 mb-2">Parcelas</p>
                    <select className="w-full border-2 border-black p-3 outline-none focus:border-lyoki-red transition-colors">
                      <option>À vista</option>
                      <option>2x sem juros</option>
                      <option>3x sem juros</option>
                    </select>
                  </div>
                </div> */}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-5 font-bold uppercase text-lg hover:bg-lyoki-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-4 border-black hover:border-lyoki-red"
                >
                  {loading ? "PROCESSANDO..." : "Continuar"}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border-4 border-black p-6 shadow-[8px_8px_0px_0px_#DC143C] sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-grunge text-2xl text-black">
                  RESUMO DO PEDIDO ({cart.length})
                </h2>
                <Link
                  to="/cart"
                  className="text-sm text-lyoki-red hover:underline font-semibold"
                >
                  Editar carrinho
                </Link>
              </div>

              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 items-center bg-white p-3 border-2 border-black"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.image}
                        className="w-16 h-20 object-cover border-2 border-gray-300"
                        alt={item.name}
                      />
                      <span className="absolute -top-2 -right-2 bg-lyoki-red text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-black">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold uppercase text-xs truncate">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-xs mt-1">
                        Quant.: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-sm flex-shrink-0">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Promo Code & Notes */}
              <div className="space-y-2 mb-6">
                <button
                  type="button"
                  className="w-full flex items-center gap-2 justify-center border-2 border-black p-3 hover:bg-black hover:text-white transition-colors text-sm"
                >
                  <Tag size={16} />
                  <span className="font-semibold uppercase text-xs">
                    Insira o código promocional
                  </span>
                </button>
                <button
                  type="button"
                  className="w-full flex items-center gap-2 justify-center border-2 border-black p-3 hover:bg-black hover:text-white transition-colors text-sm"
                >
                  <FileText size={16} />
                  <span className="font-semibold uppercase text-xs">
                    Adicione uma observação
                  </span>
                </button>
              </div>

              {/* Totals */}
              <div className="border-t-2 border-black pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-semibold">Subtotal</span>
                  <span className="font-bold">R$ {total().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-semibold">Entrega</span>
                  <span className="font-bold">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">GRÁTIS</span>
                    ) : (
                      `R$ ${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-2xl font-bold pt-3 border-t-2 border-gray-300">
                  <span className="font-grunge">TOTAL</span>
                  <span className="text-lyoki-red">
                    R$ {(total() + shippingCost).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 bg-black text-white p-3 text-center">
                <p className="text-xs uppercase tracking-wider">
                  🔒 Checkout seguro
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
