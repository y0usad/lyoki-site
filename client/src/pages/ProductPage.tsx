import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../api";
import { useCartStore } from "../store/cartStore";
import Navbar from "../components/Navbar";
import Cart from "../components/Cart";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(Number(id)),
  });
  const { addToCart, toggleCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center font-grunge text-4xl">
        CARREGANDO...
      </div>
    );
  if (!product)
    return (
      <div className="h-screen flex items-center justify-center font-grunge text-4xl">
        Produto não encontrado
      </div>
    );

  const handleAddToCart = () => {
    const finalQuantity = product.isUnique ? 1 : quantity;
    addToCart({ ...product, quantity: finalQuantity });
    toggleCart(); // Open cart drawer
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <Cart />

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Image Section */}
          <div className="flex-1">
            <div className="aspect-[4/5] w-full max-w-xl mx-auto bg-gray-100 border border-gray-200 p-8 relative">
              <img
                src={product.image}
                className="w-full h-full object-contain mix-blend-multiply transition-transform hover:scale-110 duration-700"
                alt={product.name}
              />

              {/* Badge */}
              {product.isUnique ? (
                <div className="absolute top-4 left-4 bg-lyoki-red text-white text-xs uppercase font-bold px-3 py-2">
                  PEÇA ÚNICA
                </div>
              ) : (
                product.stock < 10 && (
                  <div className="absolute top-4 left-4 bg-lyoki-red text-white text-xs uppercase font-bold px-3 py-2">
                    ÚLTIMAS UNIDADES
                  </div>
                )
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 uppercase tracking-widest">
                <span
                  onClick={() => navigate("/")}
                  className="cursor-pointer hover:text-black"
                >
                  Início
                </span>
                <span>/</span>
                <span
                  onClick={() => navigate("/products")}
                  className="cursor-pointer hover:text-black"
                >
                  Todos os Produtos
                </span>
                <span>/</span>
                <span className="text-black">{product.name}</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-sans uppercase font-normal mb-4 tracking-wide">
                {product.name}
              </h1>
              <p className="text-2xl text-gray-800">
                R$ {product.price.toFixed(2)}
              </p>
            </div>

            {/* Quantity - Conditional based on isUnique */}
            {product.isUnique ? (
              <div className="space-y-2">
                <div className="bg-lyoki-red text-white text-xs uppercase font-bold px-3 py-2 inline-block">
                  PEÇA ÚNICO
                </div>
                <p className="text-sm text-gray-600">Estoque: 1 unidade</p>
              </div>
            ) : (
              <div className="space-y-2">
                {product.stock < 10 && <div></div>}
                <label className="text-xs font-bold uppercase">
                  Quantidade
                </label>
                <div className="flex border border-gray-300 w-32 h-10 items-center">
                  <button
                    className="px-3 h-full hover:bg-gray-100 flex items-center justify-center"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus size={14} />
                  </button>
                  <div className="flex-1 text-center text-sm">{quantity}</div>
                  <button
                    className="px-3 h-full hover:bg-gray-100 flex items-center justify-center"
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              className="bg-[#111] text-white w-full max-w-md py-4 uppercase font-bold text-sm tracking-widest hover:bg-lyoki-red transition-colors"
            >
              Adicionar ao Carrinho
            </button>

            <div className="prose prose-sm pt-8 border-t border-gray-200">
              <h3 className="uppercase font-bold text-sm mb-2">Descrição</h3>
              {product.shortDescription && (
                <p className="text-gray-800 font-medium mb-3">
                  {product.shortDescription}
                </p>
              )}
              <p className="text-gray-600 leading-relaxed mb-4">
                {product.description}
              </p>

              <h3 className="uppercase font-bold text-sm mb-2">Detalhes</h3>
              <ul className="text-gray-600 list-disc pl-4 space-y-1">
                <li>Categoria: {product.category}</li>
                <li>
                  Estoque: {product.stock}{" "}
                  {product.stock === 1 ? "unidade" : "unidades"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
