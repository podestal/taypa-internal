import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import useUpdateOrder from "../../hooks/api/order/useUpdateOrder"
import useAuthStore from "../../store/useAuthStore"
import useNotificationStore from "../../store/useNotificationStore"
import useOrderInfo from "../../store/useOrderInfo"
import useCustomerInfo from "../../store/useCustomerInfo"
import useAddressInfo from "../../store/useAddressInfo"
import useOrderStep from "../../store/useOrderStep"
import useCreateTicket from "../../hooks/sunat/useCreateTicket"
import useCreateInvoice from "../../hooks/sunat/useCreateInvoice"
import type { OrderItem } from "../../services/api/orderItemService"

interface Props {
    orderId: number
    orderItems: OrderItem[]
}
const OrderToKitchen = ({ orderId, orderItems }: Props) => {

    const access = useAuthStore(state => state.access) || ''
    const updateOrder = useUpdateOrder({ orderId })
    const addNotification = useNotificationStore(state => state.addNotification)
    const setOrderInfo = useOrderInfo(state => state.setOrderInfo)
    const setCustomerInfo = useCustomerInfo(state => state.setCustomerInfo)
    const setAddressInfo = useAddressInfo(state => state.setAddressInfo)
    const setOrderStep = useOrderStep(state => state.setOrderStep)
    const addressInfo = useAddressInfo(state => state.addressInfo)
    const createTicket = useCreateTicket({ access })
    const createInvoice = useCreateInvoice({ access })
    const [showFacturaModal, setShowFacturaModal] = useState(false)
    const [facturaFormData, setFacturaFormData] = useState({
        ruc: '',
        address: addressInfo.street || ''
    })
    const [facturaErrors, setFacturaErrors] = useState({
        ruc: '',
        address: ''
    })

    const handleSendToKitchen = () => {
        console.log('send to kitchen', orderId)
        updateOrder.mutate({
            access,
            order: {
                status: 'IK'
            } as any
        }, {
            onSuccess: () => {
                addNotification({
                    title: 'Orden enviada a cocina',
                    message: 'La orden ha sido enviada a cocina',
                    type: 'success'
                })
                setOrderInfo({
                    id: 0,
                    orderNumber: '',
                    customer: 0,
                    address: 0,
                    createdAt: '',
                    updatedAt: '',
                })
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
                setOrderStep('customer')
                createTicket.mutate({
                    order_items: orderItems.map(item => ({
                        id: item.id.toString(),
                        name: `${item.category} - ${item.dish}`,
                        quantity: item.quantity,
                        cost: item.price
                    })),
                    order_id: orderId
                })
            },
            onError: () => {
                addNotification({
                    title: 'Error al enviar la orden a cocina',
                    message: 'Error al enviar la orden a cocina',
                    type: 'error'
                })
            }
        })
    }

    const handleSendToKitchenBoleta = () => {
        updateOrder.mutate({
            access,
            order: {
                status: 'IK'
            } as any
        }, {
            onSuccess: () => {
                createTicket.mutate({
                    order_items: orderItems.map(item => ({
                        id: item.id.toString(),
                        name: `${item.category} - ${item.dish}`,
                        quantity: item.quantity,
                        cost: Number((item.price / item.quantity).toFixed(2))
                    })),
                    order_id: orderId
                }, {
                    onSuccess: () => {
                        addNotification({
                            title: 'Boleta creada y orden enviada a cocina',
                            message: 'La boleta ha sido creada y la orden enviada a cocina',
                            type: 'success'
                        })
                        // Reset form
                        setOrderInfo({
                            id: 0,
                            orderNumber: '',
                            customer: 0,
                            address: 0,
                            createdAt: '',
                            updatedAt: '',
                        })
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
                        setOrderStep('customer')
                    },
                    onError: () => {
                        addNotification({
                            title: 'Error al crear la boleta',
                            message: 'Error al crear la boleta',
                            type: 'error'
                        })
                    }
                })
            },
            onError: () => {
                addNotification({
                    title: 'Error al enviar la orden a cocina',
                    message: 'Error al enviar la orden a cocina',
                    type: 'error'
                })
            }
        })
    }

    const validateFacturaForm = () => {
        const newErrors = { ruc: '', address: '' }
        let hasError = false

        if (!facturaFormData.ruc.trim()) {
            newErrors.ruc = 'El RUC es requerido'
            hasError = true
        } else if (!/^\d{11}$/.test(facturaFormData.ruc.trim())) {
            newErrors.ruc = 'El RUC debe tener 11 dígitos'
            hasError = true
        }

        if (!facturaFormData.address.trim()) {
            newErrors.address = 'La dirección es requerida'
            hasError = true
        }

        setFacturaErrors(newErrors)
        return !hasError
    }

    const handleSendToKitchenFactura = () => {
        if (!validateFacturaForm()) return

        updateOrder.mutate({
            access,
            order: {
                status: 'IK'
            } as any
        }, {
            onSuccess: () => {
                createInvoice.mutate({
                    order_items: orderItems.map(item => ({
                        id: item.id.toString(),
                        name: `${item.category} - ${item.dish}`,
                        quantity: item.quantity,
                        cost: item.price
                    })),
                    ruc: facturaFormData.ruc.trim(),
                    address: facturaFormData.address.trim(),
                    order_id: orderId
                }, {
                    onSuccess: () => {
                        addNotification({
                            title: 'Factura creada y orden enviada a cocina',
                            message: 'La factura ha sido creada y la orden enviada a cocina',
                            type: 'success'
                        })
                        // Reset form
                        setOrderInfo({
                            id: 0,
                            orderNumber: '',
                            customer: 0,
                            address: 0,
                            createdAt: '',
                            updatedAt: '',
                        })
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
                        setOrderStep('customer')
                        setShowFacturaModal(false)
                        setFacturaFormData({
                            ruc: '',
                            address: ''
                        })
                    },
                    onError: () => {
                        addNotification({
                            title: 'Error al crear la factura',
                            message: 'Error al crear la factura',
                            type: 'error'
                        })
                    }
                })
            },
            onError: () => {
                addNotification({
                    title: 'Error al enviar la orden a cocina',
                    message: 'Error al enviar la orden a cocina',
                    type: 'error'
                })
            }
        })
    }
  return (
    <>
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="flex gap-2 justify-between"
    >
        <button
            onClick={handleSendToKitchen}
            className="w-full mt-3 cursor-pointer bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
            Ticket
        </button>
        <button
            onClick={handleSendToKitchenBoleta}
            className="w-full mt-3 cursor-pointer bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
            Boleta
        </button>
        <button
            onClick={() => {
                // Pre-fill form with available data
                setFacturaFormData({
                    ruc: '',
                    address: addressInfo.street || ''
                })
                setShowFacturaModal(true)
            }}
            className="w-full mt-3 cursor-pointer bg-yellow-600 text-white py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
        >
            Factura
        </button>
    </motion.div>

    {/* Factura Modal */}
    <AnimatePresence>
        {showFacturaModal && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={() => setShowFacturaModal(false)}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Crear Factura</h3>
                        <button
                            onClick={() => setShowFacturaModal(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                RUC <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={facturaFormData.ruc}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '')
                                    setFacturaFormData(prev => ({ ...prev, ruc: value }))
                                    if (facturaErrors.ruc) setFacturaErrors(prev => ({ ...prev, ruc: '' }))
                                }}
                                maxLength={11}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    facturaErrors.ruc ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="20123456789"
                            />
                            {facturaErrors.ruc && (
                                <p className="text-red-500 text-sm mt-1">{facturaErrors.ruc}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dirección <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={facturaFormData.address}
                                onChange={(e) => {
                                    setFacturaFormData(prev => ({ ...prev, address: e.target.value }))
                                    if (facturaErrors.address) setFacturaErrors(prev => ({ ...prev, address: '' }))
                                }}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    facturaErrors.address ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Dirección completa del cliente"
                            />
                            {facturaErrors.address && (
                                <p className="text-red-500 text-sm mt-1">{facturaErrors.address}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex space-x-3 mt-6 justify-end">
                        <motion.button
                            onClick={() => setShowFacturaModal(false)}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancelar
                        </motion.button>
                        <motion.button
                            onClick={handleSendToKitchenFactura}
                            disabled={createInvoice.isPending || updateOrder.isPending}
                            className="px-6 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {createInvoice.isPending || updateOrder.isPending ? 'Creando...' : 'Crear Factura'}
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
    </>
  )
}

export default OrderToKitchen