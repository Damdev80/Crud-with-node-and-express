"use client"

import { useState } from "react"
import { 
  FaBook, 
  FaEnvelope, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaArrowRight, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaHeart 
} from "react-icons/fa"

export const Footer = () => {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email && email.includes("@")) {
      setSubscribed(true)
      setEmail("")
      // Aquí iría la lógica para enviar el email a tu backend
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-amber-900 text-amber-50 mt-10 ">
      {/* Onda decorativa */}
      

      <div className="container mx-auto px-4 pt-8    pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Columna 1: Acerca de */}
          <div>
            <div className="flex items-center mb-4">
              <FaBook className="text-amber-300 text-2xl mr-2" />
              <h3 className="text-xl font-serif font-bold text-amber-100">Mi Biblioteca</h3>
            </div>
            <p className="text-amber-200 mb-4 leading-relaxed">
              Un espacio dedicado a los amantes de la literatura, donde podrás descubrir, organizar y disfrutar de tus libros favoritos.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-amber-800 hover:bg-amber-700 text-amber-200 p-2 rounded-full transition-colors">
                <FaFacebook />
              </a>
              <a href="#" className="bg-amber-800 hover:bg-amber-700 text-amber-200 p-2 rounded-full transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="bg-amber-800 hover:bg-amber-700 text-amber-200 p-2 rounded-full transition-colors">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-serif font-bold text-amber-100 mb-4 border-b border-amber-800 pb-2">
              Enlaces rápidos
            </h3>
            <ul className="space-y-2">
              {["Inicio", "Catálogo", "Novedades", "Autores", "Categorías", "Mi cuenta"].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-amber-200 hover:text-white flex items-center transition-colors"
                  >
                    <span className="mr-2 text-xs">❯</span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="text-lg font-serif font-bold text-amber-100 mb-4 border-b border-amber-800 pb-2">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-amber-300 mt-1 mr-3 flex-shrink-0" />
                <span className="text-amber-200">Calle Biblioteca 123, Ciudad de los Libros, CP 28000</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-amber-300 mr-3 flex-shrink-0" />
                <span className="text-amber-200">+34 912 345 678</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-amber-300 mr-3 flex-shrink-0" />
                <span className="text-amber-200">info@mibiblioteca.com</span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Newsletter */}
          <div>
            <h3 className="text-lg font-serif font-bold text-amber-100 mb-4 border-b border-amber-800 pb-2">
              Suscríbete
            </h3>
            <p className="text-amber-200 mb-3">
              Recibe nuestras novedades y recomendaciones literarias en tu correo.
            </p>
            
            {subscribed ? (
              <div className="bg-amber-800/50 p-3 rounded-lg text-center">
                <p className="text-amber-100">¡Gracias por suscribirte!</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu correo electrónico"
                    className="w-full py-2 px-4 pr-10 rounded-lg bg-amber-800/50 text-white placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-amber-700"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-amber-700 hover:bg-amber-600 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                >
                  Suscribirse
                  <FaArrowRight className="ml-2" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-amber-800 my-8"></div>

        {/* Copyright y enlaces legales */}
        <div className="flex flex-col md:flex-row justify-between items-center text-amber-300 text-sm">
          <div className="mb-4 md:mb-0">
            © {currentYear} Mi Biblioteca. Todos los derechos reservados.
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Términos y condiciones</a>
            <span className="hidden md:inline">•</span>
            <a href="#" className="hover:text-white transition-colors">Política de privacidad</a>
            <span className="hidden md:inline">•</span>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>

        {/* Firma */}
        
      </div>
    </footer>
  )
}

export default Footer
