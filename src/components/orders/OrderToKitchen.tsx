import { motion } from "framer-motion"
import useUpdateOrder from "../../hooks/api/order/useUpdateOrder"
import useAuthStore from "../../store/useAuthStore"
import useNotificationStore from "../../store/useNotificationStore"

interface Props {
    orderId: number
}
const OrderToKitchen = ({ orderId }: Props) => {

    const access = useAuthStore(state => state.access) || ''
    const updateOrder = useUpdateOrder({ orderId })
    const addNotification = useNotificationStore(state => state.addNotification)

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