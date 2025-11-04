import useAuthStore from '../../store/useAuthStore'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'

interface LogoutProps {
    isCollapsed?: boolean
}

const Logout = ({ isCollapsed = false }: LogoutProps) => {
    const clearTokens = useAuthStore((state) => state.clearTokens)
    const navigate = useNavigate()

    const handleLogout = () => {
        clearTokens()
        navigate('/login')
    }
    
    return (
        <motion.button
            onClick={handleLogout}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3 w-full px-3 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer text-gray-300 hover:bg-red-600 hover:text-white group ${
                isCollapsed ? 'px-2' : ''
            }`}
            whileHover={{ scale: 1.02, x: isCollapsed ? 0 : 2 }}
            whileTap={{ scale: 0.98 }}
        >
            <LogOut 
                size={20} 
                className="flex-shrink-0 group-hover:rotate-12 transition-transform duration-200" 
            />
            {!isCollapsed && (
                <span className="font-medium">Cerrar Sesión</span>
            )}
        </motion.button>
    )
}

export default Logout