import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Clock, CheckCircle, XCircle, User, Calendar, ShoppingCart, ChefHat, Coffee, Pizza, IceCream, ChevronDown, ChevronUp, ArrowRight, ArrowLeft } from 'lucide-react'
import CreateCustomer from '../customers/CreateCustomer'
import CreateAddress from '../addresses/CreateAddress'
import AddressesMain from '../addresses/AddressesMain'
import CategoriesMain from '../categories/CategoriesMain'
import DishesMain from '../dishes/DishesMain'
import useCreateOrder from '../../hooks/api/order/useCreateOrder'

const OrdersMain = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: {
        firstName: 'María',
        lastName: 'González',
        phone: '+52 55 1234 5678',
        address: 'Av. Reforma 123',
        addressReference: 'Entre Insurgentes y Roma Norte'
      },
      items: [
        { name: 'Pizza Margherita', category: 'Pizzas', quantity: 2, price: 150, observations: 'Sin cebolla' },
        { name: 'Coca Cola', category: 'Bebidas', quantity: 2, price: 25, observations: '' }
      ],
      total: 350,
      status: 'preparing',
      orderTime: '2025-10-23 08:35',
      estimatedDelivery: '15:00'
    },
    {
      id: 2,
      customer: {
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        phone: '+52 55 9876 5432',
        address: 'Calle Insurgentes 456',
        addressReference: 'Frente al metro Insurgentes'
      },
      items: [
        { name: 'Hamburguesa Clásica', category: 'Hamburguesas', quantity: 1, price: 120, observations: 'Bien cocida' },
        { name: 'Papas Fritas', category: 'Acompañamientos', quantity: 1, price: 45, observations: '' },
        { name: 'Agua Natural', category: 'Bebidas', quantity: 1, price: 15, observations: '' }
      ],
      total: 180,
      status: 'preparing',
      orderTime: '2025-10-23 08:40',
      estimatedDelivery: '14:45'
    },
    {
      id: 3,
      customer: {
        firstName: 'Ana',
        lastName: 'Martínez',
        phone: '+52 55 5555 1234',
        address: 'Plaza Mayor 789',
        addressReference: 'Edificio B, Depto 5'
      },
      items: [
        { name: 'Tacos al Pastor', category: 'Tacos', quantity: 6, price: 90, observations: 'Con todo' },
        { name: 'Refresco', category: 'Bebidas', quantity: 1, price: 20, observations: '' }
      ],
      total: 110,
      status: 'preparing',
      orderTime: '2025-10-23 08:45',
      estimatedDelivery: '14:15'
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState(0)
  const [currentOrder, setCurrentOrder] = useState<Array<{
    name: string
    category: string
    quantity: number
    price: number
    observations: string
  }>>([])
  const [orderInfo, setOrderInfo] = useState({
    id: 0,
    orderNumber: '',
    customer: 0,
    address: 0,
    createdAt: '',
    updatedAt: '',
  })
  const [customerInfo, setCustomerInfo] = useState({
    id: 0,
    firstName: '',
    lastName: '',
    phone: '',
  })

  const [addressInfo, setAddressInfo] = useState({
    id: 0,
    street: '',
    reference: '',
    is_primary: false,
    customer: 0,
  })

  const createOrder = useCreateOrder()
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set())
  const [currentTime, setCurrentTime] = useState(new Date())
  const [orderStep, setOrderStep] = useState<'customer' | 'address' | 'items'>('customer')

  // timer
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentTime(new Date())
  //   }, 1000)
  //   return () => clearInterval(timer)
  // }, [])

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

  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(orderId)) {
        newSet.delete(orderId)
      } else {
        newSet.add(orderId)
      }
      return newSet
    })
  }

  const handleNextStep = () => {
    if (orderStep === 'customer') {
      if (isCustomerInfoComplete()) {
        setOrderStep('address')
      }
    } else if (orderStep === 'address') {
      if (isAddressInfoComplete()) {
        setOrderStep('items')

        orderInfo.id === 0 && createOrder.mutate({
          access: 'access',
          order: {
            customer: customerInfo.id,
            address: addressInfo.id,
            created_by: 1,
          }
        }, {
          onSuccess: (data) => {
            setOrderInfo({
              id: data.id,
              orderNumber: data.order_number,
              customer: data.customer,
              address: data.address,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
            })
          },
          onError: (error) => {
            console.log('error', error);
          }
        })
      }
    }
  }

  const handleBackStep = () => {
    if (orderStep === 'address') {
      setOrderStep('customer')
    } else if (orderStep === 'items') {
      setOrderStep('address')
    }
  }

  const isCustomerInfoComplete = () => {
    return customerInfo.firstName && customerInfo.lastName && customerInfo.phone
  }

  const isAddressInfoComplete = () => {
    return addressInfo.street && addressInfo.reference
  }

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

  const createOrderInternal = () => {
    if (currentOrder.length === 0) return
    
    const total = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const newOrder = {
      id: orders.length + 1,
      customer: customerInfo,
      items: currentOrder,
      total,
      status: 'preparing' as const,
      orderTime: new Date().toLocaleString('es-MX'),
      estimatedDelivery: new Date(Date.now() + 30 * 60000).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    }
    
    setOrders(prev => [newOrder, ...prev])
    setCurrentOrder([])
    setSelectedCategory('')
    setOrderStep('customer')
    setCustomerInfo({
      id: 0,
      firstName: '',
      lastName: '',
      phone: '',
    })
    setAddressInfo({
      id: 0,
      street: '',
      reference: '',
      is_primary: false,
      customer: 0,
    })
  }

  return (
    <div className="h-full bg-gray-50">
      <>{console.log('customer Simple log', 6)}</>
      <div className="p-6">
        <motion.h1 
          className="text-3xl font-bold text-gray-900 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Gestión de Órdenes
        </motion.h1>

        {/* Kitchen Orders Display - Top */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <ChefHat className="w-6 h-6 text-orange-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Órdenes en Cocina</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {orders.filter(order => order.status === 'preparing').map((order, index) => {
                const timeElapsed = getTimeElapsed(order.orderTime)
                const isExpanded = expandedOrders.has(order.id)
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4 border-l-4 border-orange-500"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-900">#{order.id}</h3>
                      <div className={`px-2 py-1 rounded text-sm font-bold ${getTimeColor(timeElapsed)}`}>
                        {formatTimer(timeElapsed)}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      {order.customer.firstName} {order.customer.lastName}
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-3">
                      {order.items.length} artículo{order.items.length !== 1 ? 's' : ''}
                    </div>
                    
                    <motion.button
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="w-full flex items-center justify-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                      whileHover={{ scale: 1.02 }}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {isExpanded ? 'Menos' : 'Ver más'}
                    </motion.button>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-gray-200"
                        >
                          <div className="space-y-2">
                            <div className="text-xs text-gray-600">
                              <strong>Tel:</strong> {order.customer.phone}
                            </div>
                            <div className="text-xs text-gray-600">
                              <strong>Dir:</strong> {order.customer.address}
                            </div>
                            <div className="text-xs text-gray-600">
                              <strong>Ref:</strong> {order.customer.addressReference}
                            </div>
                            <div className="mt-2">
                              <div className="text-xs font-medium text-gray-700 mb-1">Artículos:</div>
                              {order.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="text-xs text-gray-600">
                                  {item.name} x{item.quantity}
                                  {item.observations && (
                                    <div className="text-orange-600 italic">Obs: {item.observations}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

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
              <div className="ml-auto flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${orderStep === 'customer' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <div className={`w-3 h-3 rounded-full ${orderStep === 'address' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <div className={`w-3 h-3 rounded-full ${orderStep === 'items' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {orderStep === 'customer' ? (
                <CreateCustomer 
                  customerInfo={customerInfo}
                  setCustomerInfo={setCustomerInfo}
                  handleNextStep={handleNextStep}
                />
              ) : orderStep === 'address' ? (
                <AddressesMain
                  addressInfo={addressInfo}
                  setAddressInfo={setAddressInfo}
                  handleNextStep={handleNextStep}
                  setOrderStep={setOrderStep}
                  customerInfo={customerInfo}
                />
              ) : (
                <motion.div
                  key="items"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Back Button */}
                  <motion.button
                    onClick={handleBackStep}
                    className="mb-6 cursor-pointer flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    whileHover={{ scale: 1.02 }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Editar información del domicilio
                  </motion.button>

                  {/* Category Selection */}
                  <CategoriesMain 
                    setSelectedCategory={setSelectedCategory}
                    selectedCategory={selectedCategory}
                  />

                  {/* Items from Selected Category */}
                  {selectedCategory && (
                    <DishesMain categoryId={selectedCategory} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>

          {/* Current Order Display */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center mb-6">
              <ShoppingCart className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Orden Actual</h2>
            </div>
            
            {currentOrder.length > 0 ? (
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
                
                <div className="mt-4 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-xl font-bold text-blue-600">
                      ${currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                    </span>
                  </div>
                  <motion.button
                    onClick={createOrderInternal}
                    className="w-full mt-3 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Crear Orden
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No hay artículos en la orden</p>
                <p className="text-sm">Selecciona una categoría y agrega artículos</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default OrdersMain