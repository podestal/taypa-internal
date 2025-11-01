import { motion } from "framer-motion"
import type { OrderByStatus } from "../../../services/api/orderService"
import getTimeElapsed from "../../../utils/getTimeElapsed"
import formatTimer from "../../../utils/formatTimer"
import getTimeColor from "../../../utils/getTimeColor"
import { useEffect, useState } from "react"
import UpdateOrderStatus from "./UpdateOrderStatus"
import Modal from "../../ui/Modal"

interface Props {
    order: OrderByStatus
    index: number
}

const OrderByStatusCard = ({ order, index }: Props) => {
    const [currentTime, setCurrentTime] = useState(new Date())
    const timeElapsed = getTimeElapsed(currentTime, order.updated_at)
    const [showMore, setShowMore] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
          setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

  return (
    <>
    <motion.div
        key={order.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`bg-gray-50 rounded-lg p-4 border-l-4 border-blue-600`}
    >
        <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg text-gray-900">#{order.order_number.split('-')[1]}</h3>
            {order.status !== 'DO' && <div className={`px-2 py-1 rounded text-sm font-bold ${getTimeColor(timeElapsed)}`}>
            {formatTimer(timeElapsed)}
            </div>}
        </div>
        
        <div className="text-sm text-gray-600 mb-2">
            {order.customer_name}
        </div>
        <div className="text-xs text-gray-600">
            <strong>Dir:</strong> {order.address_info}
        </div>
        
        <div className="flex justify-between items-center mt-4 mb-2">
            <UpdateOrderStatus orderId={order.id} orderStatus={order.status} />
            <motion.button
                onClick={() => setShowMore(true)}
                className="w-full flex items-center justify-end cursor-pointer text-blue-600 hover:text-blue-800 text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                >
                Ver más
            </motion.button>
        </div>
    </motion.div>
    <Modal 
    isOpen={showMore}
    onClose={() => setShowMore(false)}
    >
         <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-gray-200"
            >
                <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Orden #{order.order_number.split('-')[1]}</h2>
                {Object.entries(order.categories).map(([categoryName, items]) => (
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{categoryName}</h4>
                        {items.map((item) => (
                            <div key={item.id} className="pl-2 border-l-2 border-blue-300">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                <div className="flex items-center justify-start gap-2">
                                    <div className="text-lg font-bold text-blue-600">x{item.quantity}</div>
                                    <div className="font-medium text-gray-900">{item.dish}</div>
                                </div>
                                {item.observation && (
                                    <div className="text-sm text-orange-600 italic mt-1">
                                    ⚠️ {item.observation}
                                    </div>
                                )}
                                </div>
                                <div className="text-right">
                                    <div className="text-lg ">S/. {item.price?.toFixed(2)}</div>
                                </div>
                            </div>
                            </div>
                        ))}
                    </div>
                ))}
                <div className="flex items-center justify-between text-lg font-bold mt-4 border-t border-gray-200 pt-4">
                    <h2>Total:</h2>
                    <p>S/.{Object.values(order.categories).reduce((acc, item) => acc + (item.reduce((acc, item) => acc + (item.price ?? 0), 0)), 0).toFixed(2)}</p>
                </div>
                </div>
            </motion.div>
    </Modal>
    </>
  )
}

export default OrderByStatusCard