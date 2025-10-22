import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Clock, CheckCircle, XCircle, User, MapPin, Phone, Calendar } from 'lucide-react'

const OrdersMain = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      customerName: 'María González',
      customerPhone: '+52 55 1234 5678',
      customerAddress: 'Av. Reforma 123, CDMX',
      items: [
        { name: 'Pizza Margherita', quantity: 2, price: 150 },
        { name: 'Coca Cola', quantity: 2, price: 25 }
      ],
      total: 350,
      status: 'pending',
      orderTime: '2024-01-15 14:30',
      estimatedDelivery: '15:00'
    },
    {
      id: 2,
      customerName: 'Carlos Rodríguez',
      customerPhone: '+52 55 9876 5432',
      customerAddress: 'Calle Insurgentes 456, CDMX',
      items: [
        { name: 'Hamburguesa Clásica', quantity: 1, price: 120 },
        { name: 'Papas Fritas', quantity: 1, price: 45 },
        { name: 'Agua Natural', quantity: 1, price: 15 }
      ],
      total: 180,
      status: 'preparing',
      orderTime: '2024-01-15 14:15',
      estimatedDelivery: '14:45'
    },
    {
      id: 3,
      customerName: 'Ana Martínez',
      customerPhone: '+52 55 5555 1234',
      customerAddress: 'Plaza Mayor 789, CDMX',
      items: [
        { name: 'Tacos al Pastor', quantity: 6, price: 90 },
        { name: 'Refresco', quantity: 1, price: 20 }
      ],
      total: 110,
      status: 'delivered',
      orderTime: '2024-01-15 13:45',
      estimatedDelivery: '14:15'
    }
  ])

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    items: [{ name: '', quantity: 1, price: 0 }]
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData(prev => ({ ...prev, items: newItems }))
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, price: 0 }]
    }))
  }

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, items: newItems }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const total = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const newOrder = {
      id: orders.length + 1,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerAddress: formData.customerAddress,
      items: formData.items,
      total,
      status: 'pending' as const,
      orderTime: new Date().toLocaleString('es-MX'),
      estimatedDelivery: new Date(Date.now() + 30 * 60000).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    }
    
    setOrders(prev => [newOrder, ...prev])
    setFormData({
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      items: [{ name: '', quantity: 1, price: 0 }]
    })
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
          {/* Order Form */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center mb-6">
              <Plus className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Nueva Orden</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Customer Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Cliente
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+52 55 1234 5678"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Calle, número, colonia"
                    required
                  />
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Artículos
                  </label>
                  <motion.button
                    type="button"
                    onClick={addItem}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    + Agregar artículo
                  </motion.button>
                </div>

                <AnimatePresence>
                  {formData.items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-2 mb-2"
                    >
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nombre del artículo"
                        required
                      />
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                        required
                      />
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Precio"
                        min="0"
                        step="0.01"
                        required
                      />
                      {formData.items.length > 1 && (
                        <motion.button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="px-2 py-2 text-red-600 hover:text-red-800"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <XCircle className="w-4 h-4" />
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <motion.button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Crear Orden
              </motion.button>
            </form>
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
                          <User className="w-4 h-4 mr-1" />
                          {order.customerName}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {order.customerPhone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {order.customerAddress}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {order.orderTime}
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="text-sm text-gray-600 mb-2">Artículos:</div>
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>${item.price * item.quantity}</span>
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