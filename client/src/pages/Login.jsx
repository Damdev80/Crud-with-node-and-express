"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaSignInAlt, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaBook } from "react-icons/fa"

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!form.email || !form.password) {
      setError("Por favor, completa todos los campos")
      return
    }

    try {
      setLoading(true)
      // Simulación de tiempo de carga
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulación de login exitoso
      navigate("/dashboard")
    } catch (err) {
      setError("Error al iniciar sesión. Verifica tus credenciales.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#e3f0fb] via-[#f7fafc] to-[#79b2e9] relative overflow-hidden py-10 px-4">
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

      {/* Logo y título */}
      <div className="mb-6 flex flex-col items-center z-10">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
          <FaBook className="text-4xl text-[#2366a8]" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#2366a8] tracking-wide text-center">
          Mi Biblioteca Digital
        </h1>
      </div>

      {/* Formulario */}
      <div className="bg-white/90 rounded-3xl shadow-xl p-0 flex flex-col items-center max-w-md w-full z-10 backdrop-blur-md border border-white/50 overflow-hidden">
        <div className="w-full flex flex-col items-center bg-gradient-to-r from-[#2366a8] to-[#79b2e9] p-8 relative">
          <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-sm"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm">
              <FaSignInAlt className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white mb-1">Bienvenido de nuevo</h2>
            <p className="text-blue-100 text-center">Accede a tu cuenta para continuar</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full px-8 py-8 flex flex-col gap-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-[#2366a8] font-medium text-sm">
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-[#79b2e9]" />
              </div>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="w-full border border-[#79b2e9]/50 focus:border-[#2366a8] rounded-xl pl-10 pr-4 py-3 text-gray-700 bg-white/80 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-[#2366a8]/20"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-[#2366a8] font-medium text-sm">
                Contraseña
              </label>
              <button
                type="button"
                className="text-xs text-[#2366a8] hover:text-[#79b2e9] transition-colors"
                onClick={() => navigate("/forgot-password")}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-[#79b2e9]" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border border-[#79b2e9]/50 focus:border-[#2366a8] rounded-xl pl-10 pr-10 py-3 text-gray-700 bg-white/80 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-[#2366a8]/20"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#79b2e9] hover:text-[#2366a8] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#2366a8] to-[#79b2e9] hover:from-[#1d5a9a] hover:to-[#5a9de0] text-white font-semibold py-3 rounded-xl transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-[#2366a8] focus:ring-offset-2 relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#79b2e9]/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
            <span className="relative flex items-center justify-center">
              {loading ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <FaSignInAlt className="mr-2" />
              )}
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </span>
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-gray-300 flex-grow"></div>
            <span className="mx-3 text-sm text-gray-500">o</span>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>

          <button
            type="button"
            className="w-full bg-white hover:bg-[#e3f0fb] text-[#2366a8] font-semibold py-3 rounded-xl transition-all border border-[#79b2e9] focus:outline-none focus:ring-2 focus:ring-[#79b2e9] focus:ring-offset-2"
            onClick={() => navigate("/register")}
          >
            Crear una cuenta nueva
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center z-10">
        <p className="text-[#2366a8] text-sm">
          &copy; {new Date().getFullYear()} Mi Biblioteca Digital. Todos los derechos reservados.
        </p>
        <div className="flex justify-center space-x-4 mt-2 text-xs text-[#2366a8]/70">
          <a href="#" className="hover:text-[#2366a8] transition-colors">
            Términos de servicio
          </a>
          <span>•</span>
          <a href="#" className="hover:text-[#2366a8] transition-colors">
            Política de privacidad
          </a>
          <span>•</span>
          <a href="#" className="hover:text-[#2366a8] transition-colors">
            Ayuda
          </a>
        </div>
      </div>
    </div>
  )
}
