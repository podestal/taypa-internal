import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ChefHat, Timer } from 'lucide-react'

const KitchenMain = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      items: [
        { name: 'Pizza Margherita', category: 'Pizzas', quantity: 2, price: 150, observations: 'Sin cebolla' },
        { name: 'Coca Cola', category: 'Bebidas', quantity: 2, price: 25, observations: '' }
      ],
      total: 350,
      status: 'pending',
      orderTime: '2025-10-23 08:10',
      estimatedDelivery: '15:00',
      kitchenNotes: 'Orden urgente'
    },
    {
      id: 2,
      items: [
        { name: 'Hamburguesa Clásica', category: 'Hamburguesas', quantity: 1, price: 120, observations: 'Bien cocida' },
        { name: 'Papas Fritas', category: 'Acompañamientos', quantity: 1, price: 45, observations: '' },
        { name: 'Agua Natural', category: 'Bebidas', quantity: 1, price: 15, observations: '' }
      ],
      total: 180,
      status: 'preparing',
      orderTime: '2024-01-15 14:15',
      estimatedDelivery: '14:45',
      kitchenNotes: ''
    },
    {
      id: 3,
      items: [
        { name: 'Tacos al Pastor', category: 'Tacos', quantity: 6, price: 90, observations: 'Con todo' },
        { name: 'Refresco', category: 'Bebidas', quantity: 1, price: 20, observations: '' }
      ],
      total: 110,
      status: 'pending',
      orderTime: '2024-01-15 14:00',
      estimatedDelivery: '14:30',
      kitchenNotes: ''
    },
    {
      id: 4,
      items: [
        { name: 'Pizza Pepperoni', category: 'Pizzas', quantity: 1, price: 170, observations: 'Extra queso' },
        { name: 'Ensalada César', category: 'Acompañamientos', quantity: 1, price: 60, observations: 'Sin crutones' }
      ],
      total: 230,
      status: 'pending',
      orderTime: '2024-01-15 13:45',
      estimatedDelivery: '14:15',
      kitchenNotes: 'Cliente VIP'
    },
    {
      id: 5,
      items: [
        { name: 'Hamburguesa BBQ', category: 'Hamburguesas', quantity: 2, price: 140, observations: 'Medio cocida' },
        { name: 'Nachos', category: 'Acompañamientos', quantity: 1, price: 55, observations: 'Extra salsa' }
      ],
      total: 335,
      status: 'preparing',
      orderTime: '2024-01-15 13:30',
      estimatedDelivery: '14:00',
      kitchenNotes: ''
    },
    {
      id: 6,
      items: [
        { name: 'Pizza Hawaiana', category: 'Pizzas', quantity: 1, price: 180, observations: '' },
        { name: 'Coca Cola', category: 'Bebidas', quantity: 1, price: 25, observations: '' }
      ],
      total: 205,
      status: 'pending',
      orderTime: '2024-01-15 13:20',
      estimatedDelivery: '13:50',
      kitchenNotes: ''
    }
  ])

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getTimeElapsed = (orderTime: string) => {
    const orderDate = new Date(orderTime)
    const elapsed = Math.floor((currentTime.getTime() - orderDate.getTime()) / 1000) // seconds
    return elapsed
  }

  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getTimeColor = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    if (minutes < 5) return 'text-green-600 bg-green-100'
    if (minutes < 10) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  // Sort orders by time (oldest first - queue order)
  const sortedOrders = [...orders].sort((a, b) => {
    const timeA = new Date(a.orderTime).getTime()
    const timeB = new Date(b.orderTime).getTime()
    return timeA - timeB
  })

  return (
    <div className="h-full bg-gray-50">
      <div className="p-6">
        <motion.div
          className="flex items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ChefHat className="w-8 h-8 text-orange-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Cocina</h1>
        </motion.div>

        {/* Orders Grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sortedOrders.map((order, index) => {
              const timeElapsed = getTimeElapsed(order.orderTime)
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
                >
                  {/* Order Header with Timer */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Orden #{order.id}</h3>
                      <div className="text-sm text-gray-600">
                        {new Date(order.orderTime).toLocaleTimeString('es-MX', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                    <div className={`px-3 py-2 rounded-lg font-bold text-lg ${getTimeColor(timeElapsed)}`}>
                      {formatTimer(timeElapsed)}
                    </div>
                  </div>

                  {/* Kitchen Notes */}
                  {order.kitchenNotes && (
                    <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 mb-4">
                      <div className="text-sm font-medium text-orange-800">
                        📝 {order.kitchenNotes}
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-600">{item.category}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">x{item.quantity}</div>
                          </div>
                        </div>
                        
                        {item.observations && (
                          <div className="text-sm text-orange-600 font-medium bg-orange-50 p-2 rounded">
                            ⚠️ {item.observations}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default KitchenMain