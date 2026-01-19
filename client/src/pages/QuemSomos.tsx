import { Skull, Zap, Heart } from 'lucide-react'
import Navbar from '../components/Navbar'
import Cart from '../components/Cart'
import Footer from '../components/Footer'

export default function QuemSomos() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Cart />

            {/* Hero Section */}
            <div className="relative h-[400px] bg-black flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-lyoki-red/20 to-black/80 z-10"></div>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 text-9xl">💀</div>
                    <div className="absolute bottom-10 right-10 text-9xl">⚡</div>
                </div>
                <div className="relative z-20 text-center">
                    <h1 className="font-grunge text-7xl text-white mb-4">QUEM SOMOS</h1>
                    <div className="w-32 h-1 bg-lyoki-red mx-auto"></div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-16">
                {/* Intro */}
                <div className="mb-16 text-center">
                    <p className="text-2xl font-bold text-black mb-6">
                        LYOKI NÃO É APENAS UMA MARCA. É UM MOVIMENTO.
                    </p>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        Nascemos da rebeldia, da arte de rua e da cultura underground.
                        Cada peça que criamos carrega a essência do caos organizado,
                        da liberdade de expressão e da autenticidade sem filtros.
                    </p>
                </div>

                {/* Values Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-black text-white p-8 border-4 border-lyoki-red transform hover:scale-105 transition-transform">
                        <div className="flex justify-center mb-4">
                            <Skull size={48} className="text-lyoki-red" />
                        </div>
                        <h3 className="font-grunge text-2xl mb-4 text-center">ATITUDE</h3>
                        <p className="text-gray-300 text-center text-sm">
                            Não seguimos tendências. Criamos nossa própria identidade
                            e inspiramos quem tem coragem de ser diferente.
                        </p>
                    </div>

                    <div className="bg-black text-white p-8 border-4 border-lyoki-red transform hover:scale-105 transition-transform">
                        <div className="flex justify-center mb-4">
                            <Zap size={48} className="text-lyoki-red" />
                        </div>
                        <h3 className="font-grunge text-2xl mb-4 text-center">ENERGIA</h3>
                        <p className="text-gray-300 text-center text-sm">
                            Cada drop é uma explosão de criatividade. Designs únicos
                            que gritam personalidade e quebram padrões.
                        </p>
                    </div>

                    <div className="bg-black text-white p-8 border-4 border-lyoki-red transform hover:scale-105 transition-transform">
                        <div className="flex justify-center mb-4">
                            <Heart size={48} className="text-lyoki-red" />
                        </div>
                        <h3 className="font-grunge text-2xl mb-4 text-center">COMUNIDADE</h3>
                        <p className="text-gray-300 text-center text-sm">
                            Somos uma família de rebeldes, artistas e sonhadores.
                            Juntos, criamos mais do que moda: criamos cultura.
                        </p>
                    </div>
                </div>

                {/* Story */}
                <div className="bg-gray-100 p-8 md:p-12 border-l-8 border-lyoki-red mb-16">
                    <h2 className="font-grunge text-4xl mb-6">NOSSA HISTÓRIA</h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                        <p>
                            Tudo começou nas ruas, onde a arte encontra a rebeldia.
                            LYOKI nasceu do desejo de criar algo autêntico, sem amarras,
                            sem regras impostas pela indústria da moda tradicional.
                        </p>
                        <p>
                            Inspirados pelo punk, grunge, streetwear e pela cultura dos
                            skatistas e grafiteiros, decidimos criar peças que representam
                            quem realmente somos: livres, intensos e sem medo de expressar.
                        </p>
                        <p>
                            Cada coleção é uma declaração. Cada estampa conta uma história.
                            E cada pessoa que veste LYOKI se torna parte dessa narrativa
                            de resistência criativa e autenticidade brutal.
                        </p>
                    </div>
                </div>

                {/* Mission */}
                <div className="text-center bg-black text-white p-12 border-4 border-black shadow-[8px_8px_0px_0px_#DC143C]">
                    <h2 className="font-grunge text-4xl mb-6 text-lyoki-red">NOSSA MISSÃO</h2>
                    <p className="text-xl leading-relaxed max-w-2xl mx-auto">
                        Vestir quem não tem medo de ser autêntico. Criar arte vestível
                        que desafia o comum e celebra o extraordinário em cada um de nós.
                    </p>
                    <div className="mt-8 inline-block">
                        <div className="text-6xl font-grunge text-lyoki-red">
                            SEJA VOCÊ. SEJA LYOKI.
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
