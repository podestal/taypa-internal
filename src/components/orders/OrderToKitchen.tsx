
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import useUpdateOrder from "../../hooks/api/order/useUpdateOrder"
import useAuthStore from "../../store/useAuthStore"
import useNotificationStore from "../../store/useNotificationStore"
import useOrderInfo from "../../store/useOrderInfo"
import useCustomerInfo from "../../store/useCustomerInfo"
import useAddressInfo from "../../store/useAddressInfo"
import useOrderStep from "../../store/useOrderStep"
import type { OrderItem } from "../../services/api/orderItemService"
import axios from "axios"

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


    const handleSendToKitchen = (paymentMethod: 'EF' | 'VW') => {
        console.log('send to kitchen', orderId)
        
        // Build order update object
        const orderUpdate: any = {
            status: 'DO'
        }
        
        // Only add payment_method if it's Effectivo (EF)
        if (paymentMethod === 'EF') {
            orderUpdate.payment_method = 'EF'
        }
        
        updateOrder.mutate({
            access,
            order: orderUpdate
        }, {
            onSuccess: async () => {
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
                // try {
                //     const response = await axios.post(
                //       `${import.meta.env.VITE_TAXES_URL}documents/generate-ticket/`,
                //       {
                //         order_items:  orderItems.map(item => ({
                //             id: item.id.toString(),
                //             name: `${item.category} - ${item.dish}`,
                //             quantity: item.quantity,
                //             cost: Number((item.price / item.quantity).toFixed(2))
                //         })),
                //         order_number: orderId.toString(),
                //         document_type: 'ticket',
                //       },
                //       {
                //         responseType: 'blob',
                //         headers: {
                //           'Authorization': `JWT ${access}`,
                //         },
                //       }
                //     );
                
                //     const blob = new Blob([response.data], { type: 'application/pdf' });
                //     const url = window.URL.createObjectURL(blob);
                    
                //     // Open in new tab
                //     window.open(url, '_blank');
                    
                //     // Clean up URL after a delay (optional)
                //     // setTimeout(() => window.URL.revokeObjectURL(url), 100);
                //   } catch (error) {
                //     console.error('Error generating ticket:', error);
                //   }
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
    className="space-y-3 my-6"
    >
        {/* Payment Method Selection */}
        <p className="text-sm font-medium text-gray-700 mb-2">Enviar a cocina:</p>
        <div className="flex gap-2">
            {/* <button
                onClick={() => handleSendToKitchen('EF')}
                disabled={updateOrder.isPending}
                className="flex-1 py-3 px-4 rounded-lg font-medium transition-colors cursor-pointer text-xs bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
                {updateOrder.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                )}
                <span>{updateOrder.isPending ? 'Enviando...' : 'Efectivo'}</span>
            </button> */}
            <button
                onClick={() => handleSendToKitchen('VW')}
                disabled={updateOrder.isPending}
                className="flex-1 py-3 px-4 rounded-lg font-medium transition-colors cursor-pointer text-xs bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
                {updateOrder.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                )}
                <span>{updateOrder.isPending ? 'Enviando...' : 'Yape'}</span>
            </button>
        </div>
    </motion.div>
    </>
  )
}

export default OrderToKitchen