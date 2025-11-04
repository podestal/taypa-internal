import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn } from 'lucide-react'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isFocused, setIsFocused] = useState({ email: false, password: false })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login attempt:', { email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-red-50 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gray-800 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -150, 0],
            y: [0, 150, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        className="relative z-10 w-full max-w-md"
      >
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 p-8"
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <LogIn className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h1>
            <p className="text-gray-600 text-sm">Inicia sesión en tu cuenta para continuar</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`w-5 h-5 transition-colors ${
                    isFocused.email ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused({ ...isFocused, email: true })}
                  onBlur={() => setIsFocused({ ...isFocused, email: false })}
                  placeholder="tu.correo@ejemplo.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`w-5 h-5 transition-colors ${
                    isFocused.password ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused({ ...isFocused, password: true })}
                  onBlur={() => setIsFocused({ ...isFocused, password: false })}
                  placeholder="Ingresa tu contraseña"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-between text-sm"
            >
              <label className="flex items-center text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2 w-4 h-4 rounded border-gray-300 bg-white text-blue-600 focus:ring-blue-600 focus:ring-2"
                />
                <span>Recordarme</span>
              </label>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Iniciar Sesión</span>
              <LogIn className="w-5 h-5" />
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center text-sm text-gray-600"
          >
            ¿No tienes una cuenta?{' '}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              Regístrate
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoginPage