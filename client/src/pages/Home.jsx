"use client"

import { useNavigate } from "react-router-dom"
import { FaBook, FaSignInAlt, FaUserPlus, FaSearch, FaExchangeAlt, FaChartBar, FaBookOpen } from "react-icons/fa"

export default function Home() {
  const navigate = useNavigate()

  // Características principales
  const features = [
    {
      icon: <FaSearch />,
      title: "Búsqueda Avanzada",
      description: "Encuentra cualquier libro por título, autor, género o ISBN en segundos.",
    },
    {
      icon: <FaExchangeAlt />,
      title: "Gestión de Préstamos",
      description: "Controla fácilmente los préstamos, devoluciones y reservas de tu colección.",
    },
    {
      icon: <FaChartBar />,
      title: "Estadísticas Detalladas",
      description: "Visualiza datos sobre tus lecturas, géneros favoritos y hábitos de lectura.",
    },
    {
      icon: <FaBookOpen />,
      title: "Catálogo Digital",
      description: "Organiza tu biblioteca con portadas, sinopsis y valoraciones personalizadas.",
    },
  ]

  // Estadísticas (simuladas)
  const stats = [
    { value: "10,000+", label: "Libros Catalogados" },
    { value: "5,000+", label: "Usuarios Activos" },
    { value: "98%", label: "Satisfacción" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#e3f0fb] via-[#f7fafc] to-[#79b2e9] relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M0,0 L100,0 L100,100 L0,100 Z"
              fill="none"
              stroke="#2366a8"
              strokeWidth="0.15"
              strokeDasharray="6,3"
            />
          </svg>
        </div>

        {/* Círculos decorativos */}
        <div className="absolute top-[10%] right-[15%] w-64 h-64 rounded-full bg-[#79b2e9]/10 blur-2xl"></div>
        <div className="absolute bottom-[20%] left-[10%] w-80 h-80 rounded-full bg-[#2366a8]/10 blur-3xl"></div>

        {/* Iconos flotantes */}
        <div className="absolute top-[15%] left-[20%] text-[#2366a8]/10 text-7xl transform rotate-12">
          <FaBook />
        </div>
        <div className="absolute bottom-[25%] right-[15%] text-[#2366a8]/10 text-6xl transform -rotate-12">
          <FaBook />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-12 flex flex-col items-center z-10">
        {/* Sección de héroe */}
        <div className="w-full max-w-6xl bg-white/90 rounded-3xl shadow-xl overflow-hidden backdrop-blur-sm border border-white/50 mb-16">
          <div className="flex flex-col md:flex-row">
            {/* Contenido del héroe */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-block bg-blue-100 p-3 rounded-xl mb-6">
                <FaBook className="text-3xl text-[#2366a8]" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2366a8] mb-4 leading-tight">
                Tu Biblioteca Digital Personal
              </h1>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Organiza, descubre y disfruta de tu colección de libros con nuestra plataforma intuitiva diseñada para
                amantes de la lectura.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#2366a8] to-[#79b2e9] hover:from-[#1d5a9a] hover:to-[#5a9de0] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-[#2366a8] focus:ring-offset-2 relative overflow-hidden group"
                  onClick={() => navigate("/login")}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#79b2e9]/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  <span className="relative flex items-center">
                    <FaSignInAlt className="mr-2" />
                    Iniciar Sesión
                  </span>
                </button>
                <button
                  className="flex items-center justify-center gap-3 bg-white hover:bg-[#e3f0fb] text-[#2366a8] font-bold py-4 px-8 rounded-xl transition-all border border-[#79b2e9] shadow-md focus:outline-none focus:ring-2 focus:ring-[#79b2e9] focus:ring-offset-2"
                  onClick={() => navigate("/register")}
                >
                  <FaUserPlus className="mr-2" />
                  Crear Cuenta
                </button>
              </div>
            </div>

            {/* Imagen del héroe */}
            <div className="md:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2366a8] to-[#79b2e9] transform skew-x-6 -right-20 rounded-bl-[100px]"></div>
              <div className="relative h-full p-8 md:p-12 flex items-center justify-center">
                <div className="relative w-full max-w-md transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="absolute inset-0 bg-black/20 blur-xl transform -translate-y-4 translate-x-4 rounded-lg"></div>
                  <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl border-4 border-white">
                    <div className="aspect-[4/3] bg-gradient-to-br from-[#e3f0fb] to-[#79b2e9] p-6 flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-4 w-full">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="aspect-[2/3] bg-white rounded-md shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform"
                          >
                            <div className="h-2/3 bg-gradient-to-br from-amber-100 to-amber-200"></div>
                            <div className="p-2">
                              <div className="h-2 bg-gray-200 rounded mb-1"></div>
                              <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                          <div className="h-3 bg-gray-100 rounded w-16"></div>
                        </div>
                        <div className="h-8 w-8 bg-[#2366a8] rounded-full flex items-center justify-center text-white">
                          <FaSearch className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="w-full max-w-4xl bg-gradient-to-r from-[#2366a8] to-[#79b2e9] rounded-2xl shadow-lg mb-16 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-blue-400/30">
            {stats.map((stat, index) => (
              <div key={index} className="p-8 text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Características */}
        <div className="w-full max-w-6xl mb-16">
          <h2 className="text-3xl font-serif font-bold text-center text-[#2366a8] mb-12">
            Todo lo que necesitas para gestionar tu biblioteca
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-white/50 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-[#2366a8] text-2xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonios */}
        <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-8 mb-16 border border-white/50">
          <h2 className="text-2xl font-serif font-bold text-center text-[#2366a8] mb-8">
            Lo que dicen nuestros usuarios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "María García",
                role: "Bibliotecaria",
                quote:
                  "Ha simplificado enormemente la gestión de nuestra biblioteca escolar. Los estudiantes adoran la interfaz.",
              },
              {
                name: "Carlos Rodríguez",
                role: "Lector ávido",
                quote:
                  "Por fin puedo organizar mi colección personal de más de 500 libros de manera eficiente y visual.",
              },
              {
                name: "Laura Martínez",
                role: "Club de lectura",
                quote: "Nuestro club de lectura utiliza esta plataforma para coordinar lecturas y compartir opiniones.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg">
                <p className="italic text-gray-600 mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#2366a8] rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="w-full max-w-3xl bg-gradient-to-r from-[#2366a8] to-[#79b2e9] rounded-2xl shadow-lg p-8 text-center mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">¿Listo para organizar tu biblioteca?</h2>
          <p className="text-blue-100 mb-6">Únete a miles de lectores que ya disfrutan de nuestra plataforma</p>
          <button
            className="bg-white hover:bg-blue-50 text-[#2366a8] font-bold py-3 px-8 rounded-xl transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#2366a8]"
            onClick={() => navigate("/register")}
          >
            Comenzar Ahora — Es Gratis
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#2366a8]/95 text-white py-8 mt-auto z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <FaBook className="text-2xl mr-2" />
              <span className="text-xl font-serif font-bold">Biblioteca Virtual</span>
            </div>
            <div className="text-blue-100 text-sm">
              &copy; {new Date().getFullYear()} Biblioteca Virtual. Todos los derechos reservados.
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-blue-100 hover:text-white transition-colors">
                Términos
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition-colors">
                Privacidad
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition-colors">
                Ayuda
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
