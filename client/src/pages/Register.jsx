"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaUserPlus, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaBook, FaCheck, FaTimes } from "react-icons/fa"

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    match: false,
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })

    // Limpiar error cuando el usuario comienza a escribir
    if (error) setError("")
  }

  // Validar fortaleza de contraseña
  useEffect(() => {
    const password = form.password
    const confirm = form.confirm

    // Validaciones individuales
    const hasLength = password.length >= 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const passwordsMatch = password === confirm && password !== ""

    setValidations({
      length: hasLength,
      uppercase: hasUppercase,
      lowercase: hasLowercase,
      number: hasNumber,
      special: hasSpecial,
      match: passwordsMatch,
    })

    // Calcular fortaleza (0-100)
    let strength = 0
    if (hasLength) strength += 20
    if (hasUppercase) strength += 20
    if (hasLowercase) strength += 20
    if (hasNumber) strength += 20
    if (hasSpecial) strength += 20
    setPasswordStrength(strength)
  }, [form.password, form.confirm])

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return ""
    if (passwordStrength <= 20) return "Muy débil"
    if (passwordStrength <= 40) return "Débil"
    if (passwordStrength <= 60) return "Moderada"
    if (passwordStrength <= 80) return "Fuerte"
    return "Muy fuerte"
  }

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200"
    if (passwordStrength <= 20) return "bg-red-500"
    if (passwordStrength <= 40) return "bg-orange-500"
    if (passwordStrength <= 60) return "bg-yellow-500"
    if (passwordStrength <= 80) return "bg-green-400"
    return "bg-green-600"
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validaciones básicas
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Por favor, completa todos los campos")
      return
    }
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden")
      return
    }
    if (passwordStrength < 60) {
      setError("Por favor, utiliza una contraseña más segura")
      return
    }

    try {
      setLoading(true)
      const res = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.message || "Error al registrar usuario")
        return
      }
      setTimeout(() => {
        navigate("/login")
      }, 1000)
    } catch {
      setError("Error de conexión con el servidor")
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
              <FaUserPlus className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white mb-1">Crear una cuenta</h2>
            <p className="text-blue-100 text-center">Únete a nuestra comunidad de lectores</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full px-8 py-8 flex flex-col gap-5">
          {/* Nombre */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-[#2366a8] font-medium text-sm">
              Nombre completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-[#79b2e9]" />
              </div>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="w-full border border-[#79b2e9]/50 focus:border-[#2366a8] rounded-xl pl-10 pr-4 py-3 text-gray-700 bg-white/80 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-[#2366a8]/20"
                required
              />
            </div>
            {/* Advertencia si solo hay un nombre */}
            {form.name.trim() && form.name.trim().split(" ").length === 1 && (
              <div className="text-xs text-yellow-600 bg-yellow-50 rounded-lg px-3 py-2 mt-1 flex items-center gap-2">
                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
                Es recomendable ingresar también tu apellido
              </div>
            )}
          </div>

          {/* Email */}
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

          {/* Contraseña */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-[#2366a8] font-medium text-sm">
              Contraseña
            </label>
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

            {/* Indicador de fortaleza de contraseña */}
            {form.password && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Fortaleza:</span>
                  <span
                    className={`text-xs font-medium ${
                      passwordStrength <= 40
                        ? "text-red-500"
                        : passwordStrength <= 60
                          ? "text-yellow-500"
                          : "text-green-500"
                    }`}
                  >
                    {getStrengthLabel()}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStrengthColor()} transition-all duration-300`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div className="space-y-1.5">
            <label htmlFor="confirm" className="block text-[#2366a8] font-medium text-sm">
              Confirmar contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-[#79b2e9]" />
              </div>
              <input
                id="confirm"
                type={showConfirmPassword ? "text" : "password"}
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border border-[#79b2e9]/50 focus:border-[#2366a8] rounded-xl pl-10 pr-10 py-3 text-gray-700 bg-white/80 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-[#2366a8]/20"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#79b2e9] hover:text-[#2366a8] transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {form.password && form.confirm && (
              <div className="mt-1 flex items-center">
                {validations.match ? (
                  <span className="text-green-500 text-xs flex items-center">
                    <FaCheck className="mr-1" /> Las contraseñas coinciden
                  </span>
                ) : (
                  <span className="text-red-500 text-xs flex items-center">
                    <FaTimes className="mr-1" /> Las contraseñas no coinciden
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Requisitos de contraseña */}
          {form.password && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-[#2366a8] font-medium mb-2">La contraseña debe contener:</p>
              <div className="grid grid-cols-2 gap-1">
                <div className="flex items-center text-xs">
                  <span className={`mr-1 ${validations.length ? "text-green-500" : "text-gray-400"} transition-colors`}>
                    {validations.length ? <FaCheck /> : "•"}
                  </span>
                  <span className={validations.length ? "text-green-700" : "text-gray-600"}>Al menos 8 caracteres</span>
                </div>
                <div className="flex items-center text-xs">
                  <span
                    className={`mr-1 ${validations.uppercase ? "text-green-500" : "text-gray-400"} transition-colors`}
                  >
                    {validations.uppercase ? <FaCheck /> : "•"}
                  </span>
                  <span className={validations.uppercase ? "text-green-700" : "text-gray-600"}>Una mayúscula</span>
                </div>
                <div className="flex items-center text-xs">
                  <span
                    className={`mr-1 ${validations.lowercase ? "text-green-500" : "text-gray-400"} transition-colors`}
                  >
                    {validations.lowercase ? <FaCheck /> : "•"}
                  </span>
                  <span className={validations.lowercase ? "text-green-700" : "text-gray-600"}>Una minúscula</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className={`mr-1 ${validations.number ? "text-green-500" : "text-gray-400"} transition-colors`}>
                    {validations.number ? <FaCheck /> : "•"}
                  </span>
                  <span className={validations.number ? "text-green-700" : "text-gray-600"}>Un número</span>
                </div>
                <div className="flex items-center text-xs">
                  <span
                    className={`mr-1 ${validations.special ? "text-green-500" : "text-gray-400"} transition-colors`}
                  >
                    {validations.special ? <FaCheck /> : "•"}
                  </span>
                  <span className={validations.special ? "text-green-700" : "text-gray-600"}>Un carácter especial</span>
                </div>
              </div>
            </div>
          )}

          {/* Mensaje de error */}
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

          {/* Botón de registro */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#2366a8] to-[#79b2e9] hover:from-[#1d5a9a] hover:to-[#5a9de0] text-white font-semibold py-3 rounded-xl transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-[#2366a8] focus:ring-offset-2 relative overflow-hidden group mt-2"
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
                <FaUserPlus className="mr-2" />
              )}
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </span>
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-gray-300 flex-grow"></div>
            <span className="mx-3 text-sm text-gray-500">o</span>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>

          {/* Botón para ir a login */}
          <button
            type="button"
            className="w-full bg-white hover:bg-[#e3f0fb] text-[#2366a8] font-semibold py-3 rounded-xl transition-all border border-[#79b2e9] focus:outline-none focus:ring-2 focus:ring-[#79b2e9] focus:ring-offset-2"
            onClick={() => navigate("/login")}
          >
            ¿Ya tienes cuenta? Inicia sesión
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
