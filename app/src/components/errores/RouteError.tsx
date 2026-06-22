import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowLeft, Home } from 'lucide-react'

const RouteError = () => {
    const error = useRouteError()
    const navigate = useNavigate()

    let title = 'Algo salió mal'
    let message = 'Ocurrió un error inesperado al cargar esta página.'

    if (isRouteErrorResponse(error)) {
        title = `Error ${error.status}`
        message = error.statusText || message
    } else if (error instanceof Error) {
        message = error.message
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center"
            >
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-red-100 rounded-full">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
                <p className="text-gray-600 mb-6 break-words">{message}</p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                    >
                        <Home className="w-4 h-4" />
                        Inicio
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default RouteError
