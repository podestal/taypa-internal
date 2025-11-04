
import { AudioWaveform, Bike, ChartBar, ChefHat, Coins, Hamburger, PackageSearch, Tags, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Logout from '../components/auth/Logout'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navigationItems = [
    {
        name: 'Pedidos',
        path: '/orders',
        icon: <Bike />
    },
    {
        name: 'Gastos',
        path: '/tracker',
        icon: <AudioWaveform />
    },
    {
        name: 'Platos',
        path: '/dishes',
        icon: <Hamburger />
    },
    {
        name: 'Categorías',
        path: '/categories',
        icon: <Tags />
    },
    {
        name: 'Ventas',
        path: '/sales',
        icon: <ChartBar />
    },
    {
        name: 'Inventario',
        path: '/inventory',
        icon: <PackageSearch />
    },
    {
        name: 'Cocina',
        path: '/kitchen',
        icon: <ChefHat />
    },
    {
        name: 'Impuestos',
        path: '/taxes',
        icon: <Coins />
    }
  ]

  const mockUser = {
    name: 'Luis Rodriguez',
    email: 'luis@taypa.com',
    avatar: '👤',
    role: 'Admin'
  }

  return (
    <>
      {/* Mobile Hamburger Menu - Only visible on mobile */}
      <motion.div 
        className="md:hidden fixed top-4 left-4 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <motion.button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Hamburger size={24} />
        </motion.button>
      </motion.div>

      {/* Mobile Navigation Overlay - Only visible on mobile when menu is open */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Dark overlay */}
            <motion.div 
              className="absolute inset-0 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Navigation panel */}
            <motion.div 
              className="absolute top-0 left-0 w-80 h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white shadow-xl"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 200,
                duration: 0.4 
              }}
            >
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">Taypa</h1>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xl">
                  {mockUser.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {mockUser.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {mockUser.email}
                  </p>
                  <span className="inline-block px-2 py-1 text-xs bg-blue-600 text-white rounded-full mt-1">
                    {mockUser.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {navigationItems.map((item, index) => {
                  const isActive = location.pathname === item.path
                  return (
                    <motion.li 
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`}
                        >
                          <span className="text-xl">{item.icon}</span>
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      </motion.div>
                    </motion.li>
                  )
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700 space-y-3">
              <Logout isCollapsed={false} />
              <div className="text-xs text-gray-400 text-center">
                Taypa v1.0
              </div>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className={`hidden md:flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      } h-screen flex-col shadow-lg`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-white">Taypa</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xl">
            {mockUser.avatar}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {mockUser.name}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {mockUser.email}
              </p>
              <span className="inline-block px-2 py-1 text-xs bg-blue-600 text-white rounded-full mt-1">
                {mockUser.role}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 space-y-3">
        <Logout isCollapsed={isCollapsed} />
        {!isCollapsed && (
          <div className="text-xs text-gray-400 text-center pt-2">
            Taypa v1.0
          </div>
        )}
      </div>
      </div>
    </>
  )
}

export default Sidebar