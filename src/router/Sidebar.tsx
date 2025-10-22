
import { AudioWaveform, Bike, ChartBar, Hamburger, PackageSearch, Tags } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()

  const navigationItems = [
    {
        name: 'Ordenes',
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
    }
  ]

  const mockUser = {
    name: 'Luis Rodriguez',
    email: 'luis@taypa.com',
    avatar: '👤',
    role: 'Admin'
  }

  return (
    <div className={`bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-20' : 'w-64'
    } h-screen flex flex-col shadow-lg`}>
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
      <div className="p-4 border-t border-gray-700">
        {!isCollapsed && (
          <div className="text-xs text-gray-400 text-center">
            Taypa v1.0
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar