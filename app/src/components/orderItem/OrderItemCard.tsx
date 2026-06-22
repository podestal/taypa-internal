import { motion } from "framer-motion"
import type { OrderItem } from "../../services/api/orderItemService"
import { XCircle } from "lucide-react"
import useAuthStore from "../../store/useAuthStore"
import useRemoveOrderItem from "../../hooks/api/orderItem/useRemoveOrderItem"
import UpateOrderItem from "./UpateOrderItem"

interface Props {
    orderItem: OrderItem
    orderId: number
    index: number
}

const OrderItemCard = ({ orderItem, orderId, index }: Props) => {

    const access = useAuthStore(state => state.access) || ''
    const removeOrderItem = useRemoveOrderItem({ orderItemId: orderItem.id, orderId })

    const handleRemoveOrderItem = () => {
        removeOrderItem.mutate({
            access,
        })
    }
    
  return (
    <motion.div
        key={index}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="p-3 border border-gray-200 rounded-lg bg-gray-50"
    >
        <div className="flex items-center justify-between mb-2">
        
        <div>
            <div className="font-medium text-gray-900">{orderItem.dish}</div>
            <div className="text-sm text-gray-600">{orderItem.category}</div>
        </div>
        <div className="flex items-center gap-2">
            <UpateOrderItem 
                orderItem={orderItem}
                orderId={orderId}
            />
            <motion.button
            onClick={handleRemoveOrderItem}
            className="ml-2 text-red-600 hover:text-red-800"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            >
            <XCircle className="w-4 h-4" />
            </motion.button>
        </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
        {orderItem.observation}
        </p>
        <div className="text-sm text-gray-600 mt-1">
        Subtotal: ${orderItem.price}
        </div>
    </motion.div>
  )
}

export default OrderItemCard