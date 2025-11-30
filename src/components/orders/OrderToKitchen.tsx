
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


    const handleSendToKitchen = () => {
        console.log('send to kitchen', orderId)
        updateOrder.mutate({
            access,
            order: {
                status: 'IK'
            } as any
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
                try {
                    const response = await axios.post(
                      `${import.meta.env.VITE_TAXES_URL}documents/generate-ticket/`,
                      {
                        order_items:  orderItems.map(item => ({
                            id: item.id.toString(),
                            name: `${item.category} - ${item.dish}`,
                            quantity: item.quantity,
                            cost: Number((item.price / item.quantity).toFixed(2))
                        })),
                        order_number: orderId.toString(),
                        document_type: 'ticket',
                      },
                      {
                        responseType: 'blob',
                        headers: {
                          'Authorization': `JWT ${access}`,
                        },
                      }
                    );
                
                    const blob = new Blob([response.data], { type: 'application/pdf' });
                    const url = window.URL.createObjectURL(blob);
                    
                    // Open in new tab
                    window.open(url, '_blank');
                    
                    // Clean up URL after a delay (optional)
                    // setTimeout(() => window.URL.revokeObjectURL(url), 100);
                  } catch (error) {
                    console.error('Error generating ticket:', error);
                  }
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
            disabled={updateOrder.isPending}
            className="w-full mt-3 cursor-pointer bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
            {(updateOrder.isPending) && (
                <Loader2 className="w-4 h-4 animate-spin" />
            )}
            <span>{updateOrder.isPending ? 'Enviando...' : 'Enviar a cocina'}</span>
        </button>
    </motion.div>
    </>
  )
}

export default OrderToKitchen