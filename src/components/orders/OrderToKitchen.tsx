import { motion } from "framer-motion"
import useUpdateOrder from "../../hooks/api/order/useUpdateOrder"
import useAuthStore from "../../store/useAuthStore"
import useNotificationStore from "../../store/useNotificationStore"
import useOrderInfo from "../../store/useOrderInfo"
import useCustomerInfo from "../../store/useCustomerInfo"
import useAddressInfo from "../../store/useAddressInfo"
import useOrderStep from "../../store/useOrderStep"

interface Props {
    orderId: number
}
const OrderToKitchen = ({ orderId }: Props) => {

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
            }
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
    <motion.button
        onClick={handleSendToKitchen}
        className="w-full mt-3 cursor-pointer bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        >
        Mandar a Cocina
    </motion.button>
  )
}

export default OrderToKitchen