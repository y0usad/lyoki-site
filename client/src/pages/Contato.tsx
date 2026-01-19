import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import Navbar from '../components/Navbar'
import Cart from '../components/Cart'
import Footer from '../components/Footer'

export default function Contato() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Cart />
            {/* Hero Section */}
            <div className="relative h-[300px] bg-black flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-lyoki-red/20 to-black/80 z-10"></div>
                <div className="relative z-20 text-center">
                    <h1 className="font-grunge text-7xl text-white mb-4">CONTATO</h1>
                    <div className="w-32 h-1 bg-lyoki-red mx-auto"></div>
                    <p className="text-gray-300 mt-4 text-lg">Fale com a gente!</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div>
                        <h2 className="font-grunge text-4xl mb-8">FALE CONOSCO</h2>

                        <div className="space-y-6">
                            {/* Email */}
                            <div className="flex items-start gap-4 bg-gray-100 p-6 border-l-4 border-lyoki-red">
                                <div className="bg-black p-3 rounded">
                                    <Mail className="text-lyoki-red" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">EMAIL</h3>
                                    <a
                                        href="mailto:lyokisite@gmail.com"
                                        className="text-lyoki-red hover:underline text-lg"
                                    >
                                        lyokisite@gmail.com
                                    </a>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Respondemos em até 24 horas
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4 bg-gray-100 p-6 border-l-4 border-lyoki-red">
                                <div className="bg-black p-3 rounded">
                                    <Phone className="text-lyoki-red" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">TELEFONE</h3>
                                    <a
                                        href="tel:+5511999999999"
                                        className="text-lyoki-red hover:underline text-lg"
                                    >
                                        (11) 99999-9999
                                    </a>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Segunda a Sexta, 9h às 18h
                                    </p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-4 bg-gray-100 p-6 border-l-4 border-lyoki-red">
                                <div className="bg-black p-3 rounded">
                                    <MapPin className="text-lyoki-red" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">ENDEREÇO</h3>
                                    <p className="text-gray-800 text-lg">
                                        Rua Henrique Correia, 1909
                                    </p>
                                    <p className="text-gray-600">
                                        Bairro Alto, Curitiba - PR
                                    </p>
                                </div>
                            </div>

                            {/* Hours */}
                            <div className="flex items-start gap-4 bg-gray-100 p-6 border-l-4 border-lyoki-red">
                                <div className="bg-black p-3 rounded">
                                    <Clock className="text-lyoki-red" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">HORÁRIO</h3>
                                    <p className="text-gray-800">Segunda a Sexta: 9h - 18h</p>
                                    <p className="text-gray-800">Sábado: 9h - 13h</p>
                                    <p className="text-gray-600">Domingo: Fechado</p>
                                </div>
                            </div>
                        </div>

                        {/* Social CTA */}
                        <div className="mt-8 bg-black text-white p-6 border-4 border-lyoki-red">
                            <h3 className="font-grunge text-2xl mb-3">NOS SIGA NAS REDES!</h3>
                            <p className="text-gray-300 mb-4">
                                Acompanhe nossos drops e novidades
                            </p>
                            <div className="flex gap-3">
                                <a
                                    href="https://www.instagram.com/lyoki_____/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-lyoki-red hover:bg-white hover:text-black px-6 py-2 font-bold uppercase transition-colors"
                                >
                                    Instagram
                                </a>
                                <a
                                    href="https://tiktok.com/@lyoki"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-lyoki-red hover:bg-white hover:text-black px-6 py-2 font-bold uppercase transition-colors"
                                >
                                    TikTok
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div>
                        <h2 className="font-grunge text-4xl mb-8">NOSSA LOCALIZAÇÃO</h2>
                        <div className="border-4 border-black shadow-[8px_8px_0px_0px_#DC143C] overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.3456789!2d-49.2876543!3d-25.4567890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDI3JzI0LjQiUyA0OcKwMTcnMTUuNiJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                                width="100%"
                                height="450"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Localização LYOKI"
                            ></iframe>
                        </div>
                        <p className="text-gray-600 text-sm mt-4 text-center">
                            Clique no mapa para abrir no Google Maps
                        </p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="mt-16 bg-gray-100 p-8 md:p-12 border-t-4 border-lyoki-red">
                    <h2 className="font-grunge text-4xl mb-8 text-center">ENVIE SUA MENSAGEM</h2>
                    <form
                        action="mailto:lyokisite@gmail.com"
                        method="post"
                        encType="text/plain"
                        className="max-w-2xl mx-auto space-y-6"
                    >
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase">Nome</label>
                                <input
                                    type="text"
                                    name="Nome"
                                    className="w-full border-2 border-black p-3 focus:border-lyoki-red outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase">Email</label>
                                <input
                                    type="email"
                                    name="Email"
                                    className="w-full border-2 border-black p-3 focus:border-lyoki-red outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Assunto</label>
                            <input
                                type="text"
                                name="Assunto"
                                className="w-full border-2 border-black p-3 focus:border-lyoki-red outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase">Mensagem</label>
                            <textarea
                                rows={6}
                                name="Mensagem"
                                className="w-full border-2 border-black p-3 focus:border-lyoki-red outline-none resize-none"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-4 font-bold uppercase text-lg hover:bg-lyoki-red transition-colors border-4 border-black hover:border-lyoki-red"
                        >
                            Enviar Mensagem
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    )
}
