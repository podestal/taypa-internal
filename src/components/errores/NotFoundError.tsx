import { motion } from "framer-motion"
import { Home, ArrowLeft, Search, AlertCircle } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

const NotFoundError = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-blue-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Main error card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl p-12 relative overflow-hidden"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full -mr-32 -mt-32 opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-200 rounded-full -ml-24 -mb-24 opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-50 rounded-full opacity-20"></div>

          <div className="relative z-10">
            {/* 404 Number with animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <motion.h1
                animate={{ 
                  rotate: [0, -5, 5, -5, 0],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="text-9xl font-bold bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent"
              >
                404
              </motion.h1>
            </motion.div>

            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
              className="flex justify-center mb-6"
            >
              <div className="p-4 bg-red-100 rounded-full">
                <AlertCircle className="w-16 h-16 text-red-500" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-4xl font-bold text-gray-800 mb-4"
            >
              Página No Encontrada
            </motion.h2>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-gray-600 text-lg mb-2"
            >
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </motion.p>

            {/* Show attempted path */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-4 mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <Search className="w-4 h-4 text-gray-500" />
                <code className="text-sm text-gray-700 font-mono">
                  {location.pathname}
                </code>
              </div>
            </motion.div>

            {/* Decorative line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 rounded-full mb-8"
            />

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver Atrás
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg"
              >
                <Home className="w-5 h-5" />
                Ir al Inicio
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating particles effect */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-blue-400 rounded-full opacity-20"
            style={{
              left: `${15 + i * 12}%`,
              top: `${20 + (i % 4) * 25}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}

        {/* Additional help text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8 text-gray-500 text-sm"
        >
          <p>Si crees que esto es un error, por favor contacta al administrador.</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFoundError

