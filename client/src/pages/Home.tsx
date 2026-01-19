import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api";
import Navbar from "../components/Navbar";
import Cart from "../components/Cart";
import Footer from "../components/Footer";

export default function Home() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  return (
    <div className="min-h-screen relative font-sans selection:bg-lyoki-red selection:text-white">
      <Navbar />
      <Cart />

      {/* Hero Header */}
      <header className="relative w-full h-[80vh] overflow-hidden bg-gray-200 flex items-center justify-center">
        {/* Background Layer */}
        <img
          src="https://images.unsplash.com/photo-1594819047050-99defca82545?q=80&w=2400&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-50"
          alt="Background"
        />
        <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none" />

        <div className="relative z-10 text-center flex flex-col items-center">
          <h1 className="text-[15vw] leading-[0.8] font-grunge text-lyoki-red drop-shadow-[10px_10px_0px_rgba(0,0,0,0.8)] rotate-[-2deg] mix-blend-difference">
            LYOKI
          </h1>
          <div className="relative mt-8 bg-white border border-black p-2 rotate-2 shadow-[5px_5px_0px_#000]">
            <p className="font-hand text-xl md:text-3xl bg-black text-white px-6 py-2">
              ANTI-COPIA / 1 of 1 / ONLY
            </p>
            <div className="absolute -top-3 -left-3 w-4 h-4 bg-lyoki-red border border-black" />
            <div className="absolute -bottom-3 -right-3 w-4 h-4 bg-lyoki-red border border-black" />
          </div>
          {/* Image overlay */}
          <img
            src="https://images.unsplash.com/photo-1548705085-101177834f47?q=80&w=400&auto=format&fit=crop"
            className="absolute top-[-50%] left-[-20%] w-[400px] h-[500px] object-cover mix-blend-overlay opacity-50 rotate-[-15deg] hidden md:block"
          />
        </div>
      </header>

      {/* Slogan */}
      <div className="py-20 text-center uppercase tracking-[1em] text-sm font-bold font-grunge text-black">
        Anti Copia | 1 of 1 | Only
      </div>

      {/* Product Grid */}
      <main className="max-w-[1600px] mx-auto px-4 pb-32">
        {isLoading ? (
          <div className="text-center py-20 font-grunge text-4xl animate-pulse">
            LOADING CHAOS...
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20">
            {products?.map((product: any) => (
              <div
                key={product.id}
                className="group relative cursor-pointer"
                onClick={() =>
                  (window.location.href = `/product/${product.id}`)
                }
              >
                <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative mb-6 border border-transparent hover:border-black transition-all">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0 contrast-125"
                  />
                  {/* Stock Badge */}
                  {product.stock < 10 && (
                    <div className="absolute top-2 left-2 bg-lyoki-red text-white text-[10px] uppercase font-bold px-2 py-1">
                      Last Units
                    </div>
                  )}
                </div>
                <h3 className="text-center font-bold text-sm md:text-base uppercase tracking-wider font-sans">
                  {product.name}
                </h3>
                <p className="text-center text-gray-500 font-bold text-sm mt-2">
                  R$ {product.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* View All Products Button */}
        <div className="text-center mt-16">
          <a
            href="/products"
            className="inline-block bg-black text-white px-12 py-4 font-bold uppercase text-lg hover:bg-lyoki-red transition-colors border-4 border-black hover:border-lyoki-red shadow-[8px_8px_0px_0px_#DC143C] hover:shadow-[8px_8px_0px_0px_#000]"
          >
            Ver Todos os Produtos
          </a>
        </div>
      </main>

      {/* Instagram Feed */}
      <section className="bg-white text-center py-20 border-t border-black">
        <h2 className="font-grunge text-6xl mb-4 tracking-widest text-black">
          INSTAGRAM
        </h2>
        <a
          href="https://www.instagram.com/lyoki_____/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-lyoki-red hover:underline text-xl mb-12 font-bold"
        >
          @lyoki_____
        </a>

        {/* Instagram Embed Container */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gray-100 p-8 rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_#DC143C]">
            <p className="text-gray-700 mb-6 text-lg">
              Siga-nos no Instagram para ver nossos últimos drops, bastidores e novidades!
            </p>

            {/* Instagram Feed Placeholder - Replace with actual embed code */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <a
                  key={i}
                  href="https://www.instagram.com/lyoki_____/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-200 relative group overflow-hidden aspect-square border-2 border-black hover:border-lyoki-red transition-all"
                >
                  <img
                    src={`https://picsum.photos/seed/${i + 50}/600/600?grayscale`}
                    alt={`Instagram post ${i}`}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <span className="font-grunge text-2xl">@lyoki_____</span>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-8">
              <a
                href="https://www.instagram.com/lyoki_____/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black text-white px-8 py-3 font-bold uppercase hover:bg-lyoki-red transition-colors border-2 border-black"
              >
                Ver Mais no Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
