import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import OrderItemList from "./OrderItemList"

interface Props {
    orderId: number
}

const OrderItemMain = ({ orderId }: Props) => {
    
  return (
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
        <OrderItemList orderId={orderId} />
    </motion.div>
  )
}

export default OrderItemMain