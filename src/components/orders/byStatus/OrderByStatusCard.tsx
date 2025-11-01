import { AnimatePresence, motion } from "framer-motion"
import type { OrderByStatus } from "../../../services/api/orderService"
import getTimeElapsed from "../../../utils/getTimeElapsed"
import formatTimer from "../../../utils/formatTimer"
import getTimeColor from "../../../utils/getTimeColor"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import UpdateOrderStatus from "./UpdateOrderStatus"

interface Props {
    order: OrderByStatus
    index: number
}

const OrderByStatusCard = ({ order, index }: Props) => {
    const currentTime = new Date()
    const timeElapsed = getTimeElapsed(currentTime, order.updated_at)
    const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
        key={order.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`bg-gray-50 rounded-lg p-4 border-l-4 border-blue-600`}
    >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-900">#{order.order_number.split('-')[1]}</h3>
                      <div className={`px-2 py-1 rounded text-sm font-bold ${getTimeColor(timeElapsed)}`}>
                        {formatTimer(timeElapsed)}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      {order.customer_name}
                    </div>
                    <div className="text-xs text-gray-600">
                        <strong>Dir:</strong> {order.address_info}
                    </div>
                    
                    {/* <div className="text-xs text-gray-500 mb-3">
                      {order.items.length} artículo{order.items.length !== 1 ? 's' : ''}
                    </div> */}
                    
                    <div className="flex justify-between items-center mt-4 mb-2">
                        <UpdateOrderStatus orderId={order.id} orderStatus={order.status} />
                        <motion.button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="w-full flex items-center justify-end text-blue-600 hover:text-blue-800 text-sm font-medium"
                            whileHover={{ scale: 1.02 }}
                            >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            {isExpanded ? 'Menos' : 'Ver más'}
                        </motion.button>
                    
                    </div>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-gray-200"
                        >
                          <div>
          
                            <div>
                              <div className="text-xs font-medium text-gray-700 mb-1">Artículos:</div>
                              {/* {order.categories.map((item, itemIndex) => (
                                <div key={itemIndex} className="text-xs text-gray-600">
                                  {item.name} x{item.quantity}
                                  {item.observations && (
                                    <div className="text-orange-600 italic">Obs: {item.observations}</div>
                                  )}
                                </div>
                              ))} */}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
  )
}

export default OrderByStatusCard