import { motion } from "framer-motion"
import type { OrderItem } from "../../services/api/orderItemService"
import { XCircle } from "lucide-react"
import useAuthStore from "../../store/useAuthStore"
import useUpdateOrderitem from "../../hooks/api/orderItem/useUpdateOrderitem"
import useRemoveOrderItem from "../../hooks/api/orderItem/useRemoveOrderItem"
import Modal from "../ui/Modal"
import { useState } from "react"

interface Props {
    orderItem: OrderItem
    orderId: number
    index: number
}

const OrderItemCard = ({ orderItem, orderId, index }: Props) => {

    const access = useAuthStore(state => state.access) || ''
    const [isOpen, setIsOpen] = useState(false)
    const updateOrderItem = useUpdateOrderitem({ orderItemId: orderItem.id, orderId })
    const removeOrderItem = useRemoveOrderItem({ orderItemId: orderItem.id, orderId })
    // const [quantity, setQuantity] = useState(orderItem.quantity)

    // const handleIncreaseOrderItemQuantity = () => {
    //     updateOrderItem.mutate({
    //         access,
    //         orderItem: {
    //             ...orderItem,
    //             quantity: quantity + 1
    //         }
    //     })
    // }

    const handleRemoveOrderItem = () => {
        removeOrderItem.mutate({
            access,
        })
    }
    
  return (
    <>
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
        <button
          // onClick={() => updateItemQuantity(index, item.quantity - 1)}
          onClick={() => setIsOpen(true)}
          className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
        >
          -
        </button>
        <span className="w-8 text-center font-medium">{orderItem.quantity}</span>
        <button
          // onClick={() => updateItemQuantity(index, item.quantity + 1)}
          className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200"
        >
          +
        </button>
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
    <input
      type="text"
      value={orderItem.observation}
      // onChange={(e) => updateItemObservations(index, e.target.value)}
      placeholder="Observaciones (opcional)"
      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    <div className="text-sm text-gray-600 mt-1">
      Subtotal: ${orderItem.price}
    </div>
  </motion.div>
  <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
    <div>
      <h2>Editar Orden</h2>
    </div>
  </Modal>
    </>
  )
}

export default OrderItemCard