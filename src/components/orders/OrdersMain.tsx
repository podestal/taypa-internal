import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Clock, CheckCircle, XCircle, User, Calendar, ShoppingCart, ChefHat, Coffee, Pizza, IceCream, ChevronDown, ChevronUp, ArrowRight, ArrowLeft, Package, Truck } from 'lucide-react'
import CreateCustomer from '../customers/CreateCustomer'
import CreateAddress from '../addresses/CreateAddress'
import AddressesMain from '../addresses/AddressesMain'
import CategoriesMain from '../categories/CategoriesMain'
import DishesMain from '../dishes/DishesMain'
import useCreateOrder from '../../hooks/api/order/useCreateOrder'
import Order from './Order'
import OrderItemList from '../orderItem/OrderItemList'
import useCustomerInfo from '../../store/useCustomerInfo'
import useAddressInfo from '../../store/useAddressInfo'
import useOrderInfo from '../../store/useOrderInfo'
import useOrderStep from '../../store/useOrderStep'
import OrderStatusSelector from './byStatus/OrderStatusSelector'
import getTimeElapsed from '../../utils/getTimeElapsed'
import getTimeColor from '../../utils/getTimeColor'
import formatTimer from '../../utils/formatTimer'
import OrderByStatusMain from './byStatus/OrderByStatusMain'

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
  const { orderInfo, setOrderInfo } = useOrderInfo()
  const {customerInfo, setCustomerInfo} = useCustomerInfo()

  const { addressInfo, setAddressInfo } = useAddressInfo()

  const createOrder = useCreateOrder()
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set())
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<'preparing' | 'ready' | 'in_transit' | 'delivered'>('preparing')
  const { orderStep, setOrderStep } = useOrderStep()

  // timer
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentTime(new Date())
  //   }, 1000)
  //   return () => clearInterval(timer)
  // }, [])



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
            order_type: 'D',
            status: 'IP',
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
    return addressInfo.street.trim().length > 0
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
        <OrderByStatusMain />

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
                  handleNextStep={handleNextStep}
                />
              ) : orderStep === 'address' ? (
                <AddressesMain
                  handleNextStep={handleNextStep}
                />
              ) : (
                <Order
                  handleBackStep={handleBackStep}
                  setSelectedCategory={setSelectedCategory}
                  selectedCategory={selectedCategory}
                />
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
            <OrderItemList orderId={orderInfo.id} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default OrdersMain