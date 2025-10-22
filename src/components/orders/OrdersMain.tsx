import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Clock, CheckCircle, XCircle, User, Calendar, ShoppingCart, ChefHat, Coffee, Pizza, IceCream } from 'lucide-react'

const OrdersMain = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      items: [
        { name: 'Pizza Margherita', category: 'Pizzas', quantity: 2, price: 150, observations: 'Sin cebolla' },
        { name: 'Coca Cola', category: 'Bebidas', quantity: 2, price: 25, observations: '' }
      ],
      total: 350,
      status: 'pending',
      orderTime: '2024-01-15 14:30',
      estimatedDelivery: '15:00'
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
      estimatedDelivery: '14:45'
    },
    {
      id: 3,
      items: [
        { name: 'Tacos al Pastor', category: 'Tacos', quantity: 6, price: 90, observations: 'Con todo' },
        { name: 'Refresco', category: 'Bebidas', quantity: 1, price: 20, observations: '' }
      ],
      total: 110,
      status: 'delivered',
      orderTime: '2024-01-15 13:45',
      estimatedDelivery: '14:15'
    }
  ])

  const categories = [
    { id: 'pizzas', name: 'Pizzas', icon: <Pizza className="w-5 h-5" /> },
    { id: 'hamburguesas', name: 'Hamburguesas', icon: <ChefHat className="w-5 h-5" /> },
    { id: 'tacos', name: 'Tacos', icon: <ChefHat className="w-5 h-5" /> },
    { id: 'bebidas', name: 'Bebidas', icon: <Coffee className="w-5 h-5" /> },
    { id: 'acompañamientos', name: 'Acompañamientos', icon: <ChefHat className="w-5 h-5" /> },
    { id: 'postres', name: 'Postres', icon: <IceCream className="w-5 h-5" /> }
  ]

  const menuItems = {
    pizzas: [
      { name: 'Pizza Margherita', price: 150 },
      { name: 'Pizza Pepperoni', price: 170 },
      { name: 'Pizza Hawaiana', price: 180 },
      { name: 'Pizza Cuatro Quesos', price: 190 }
    ],
    hamburguesas: [
      { name: 'Hamburguesa Clásica', price: 120 },
      { name: 'Hamburguesa BBQ', price: 140 },
      { name: 'Hamburguesa Doble', price: 160 },
      { name: 'Hamburguesa Vegetariana', price: 130 }
    ],
    tacos: [
      { name: 'Tacos al Pastor', price: 15 },
      { name: 'Tacos de Asada', price: 18 },
      { name: 'Tacos de Pollo', price: 16 },
      { name: 'Tacos de Carnitas', price: 17 }
    ],
    bebidas: [
      { name: 'Coca Cola', price: 25 },
      { name: 'Agua Natural', price: 15 },
      { name: 'Refresco', price: 20 },
      { name: 'Jugo Natural', price: 30 }
    ],
    acompañamientos: [
      { name: 'Papas Fritas', price: 45 },
      { name: 'Aros de Cebolla', price: 50 },
      { name: 'Nachos', price: 55 },
      { name: 'Ensalada César', price: 60 }
    ],
    postres: [
      { name: 'Helado de Vainilla', price: 40 },
      { name: 'Pastel de Chocolate', price: 65 },
      { name: 'Flan', price: 35 },
      { name: 'Brownie', price: 45 }
    ]
  }

  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentOrder, setCurrentOrder] = useState<Array<{
    name: string
    category: string
    quantity: number
    price: number
    observations: string
  }>>([])

  const addItemToOrder = (item: { name: string; price: number }, category: string) => {
    const existingItemIndex = currentOrder.findIndex(orderItem => 
      orderItem.name === item.name && orderItem.observations === ''
    )
    
    if (existingItemIndex >= 0) {
      const updatedOrder = [...currentOrder]
      updatedOrder[existingItemIndex].quantity += 1
      setCurrentOrder(updatedOrder)
    } else {
      setCurrentOrder(prev => [...prev, {
        name: item.name,
        category: category,
        quantity: 1,
        price: item.price,
        observations: ''
      }])
    }
  }

  const updateItemQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromOrder(index)
      return
    }
    const updatedOrder = [...currentOrder]
    updatedOrder[index].quantity = quantity
    setCurrentOrder(updatedOrder)
  }

  const updateItemObservations = (index: number, observations: string) => {
    const updatedOrder = [...currentOrder]
    updatedOrder[index].observations = observations
    setCurrentOrder(updatedOrder)
  }

  const removeItemFromOrder = (index: number) => {
    setCurrentOrder(prev => prev.filter((_, i) => i !== index))
  }

  const createOrder = () => {
    if (currentOrder.length === 0) return
    
    const total = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const newOrder = {
      id: orders.length + 1,
      items: currentOrder,
      total,
      status: 'pending' as const,
      orderTime: new Date().toLocaleString('es-MX'),
      estimatedDelivery: new Date(Date.now() + 30 * 60000).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    }
    
    setOrders(prev => [newOrder, ...prev])
    setCurrentOrder([])
    setSelectedCategory('')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'preparing': return 'bg-blue-100 text-blue-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'preparing': return <CheckCircle className="w-4 h-4" />
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="h-full bg-gray-50">
      <div className="p-6">
        <motion.h1 
          className="text-3xl font-bold text-gray-900 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Gestión de Órdenes
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Creation */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center mb-6">
              <ShoppingCart className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Crear Orden</h2>
            </div>

            {/* Category Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Seleccionar Categoría</h3>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedCategory === category.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-center mb-2">
                      {category.icon}
                    </div>
                    <div className="text-sm font-medium">{category.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Items from Selected Category */}
            {selectedCategory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {menuItems[selectedCategory as keyof typeof menuItems]?.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">${item.price}</div>
                      </div>
                      <motion.button
                        onClick={() => addItemToOrder(item, categories.find(c => c.id === selectedCategory)?.name || '')}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Agregar
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Current Order Items */}
            {currentOrder.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-3">Orden Actual</h3>
                <div className="space-y-3">
                  <AnimatePresence>
                    {currentOrder.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-600">{item.category}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateItemQuantity(index, item.quantity - 1)}
                              className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateItemQuantity(index, item.quantity + 1)}
                              className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200"
                            >
                              +
                            </button>
                            <motion.button
                              onClick={() => removeItemFromOrder(index)}
                              className="ml-2 text-red-600 hover:text-red-800"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <XCircle className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={item.observations}
                          onChange={(e) => updateItemObservations(index, e.target.value)}
                          placeholder="Observaciones (opcional)"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="text-sm text-gray-600 mt-1">
                          Subtotal: ${item.price * item.quantity}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                <div className="mt-4 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-xl font-bold text-blue-600">
                      ${currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                    </span>
                  </div>
                  <motion.button
                    onClick={createOrder}
                    className="w-full mt-3 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Crear Orden
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Orders List */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Órdenes Recientes</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">Orden #{order.id}</h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {order.orderTime}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                    </div>

                    <div className="border-t pt-3">
                      <div className="text-sm text-gray-600 mb-2">Artículos:</div>
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="mb-2">
                          <div className="flex justify-between text-sm">
                            <span>{item.name} x{item.quantity}</span>
                            <span>${item.price * item.quantity}</span>
                          </div>
                          {item.observations && (
                            <div className="text-xs text-gray-500 italic mt-1">
                              Obs: {item.observations}
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="flex justify-between font-semibold text-lg mt-2 pt-2 border-t">
                        <span>Total:</span>
                        <span>${order.total}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default OrdersMain