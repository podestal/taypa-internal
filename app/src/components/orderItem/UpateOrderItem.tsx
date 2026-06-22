import { Pencil } from "lucide-react"
import { useState } from "react"
import useUpdateOrderitem from "../../hooks/api/orderItem/useUpdateOrderitem"
import type { OrderItem } from "../../services/api/orderItemService"
import Modal from "../ui/Modal"
import useAuthStore from "../../store/useAuthStore"
import useNotificationStore from "../../store/useNotificationStore"

interface Props {
    orderItem: OrderItem
    orderId: number
}

const UpateOrderItem = ({ orderItem, orderId }: Props) => {
    const access = useAuthStore(s => s.access) || ''
    const [isOpen, setIsOpen] = useState(false)
    const updateOrderItem = useUpdateOrderitem({ orderItemId: orderItem.id, orderId })
    const [quantity, setQuantity] = useState(orderItem.quantity)
    const [observation, setObservation] = useState(orderItem.observation)

    const { addNotification } = useNotificationStore()

    const handleUpdateOrderItem = () => {
        if (quantity > 0) {
            updateOrderItem.mutate({
                access,
                orderItem: {
                    quantity,
                    observation
                }
            }, {
                onSuccess: () => {
                    addNotification({
                        title: 'Orden actualizada',
                        message: 'La orden ha sido actualizada correctamente',
                        type: 'success'
                    })
                },
                onError: () => {
                    addNotification({
                        title: 'Error al actualizar la orden',
                        message: 'Ha ocurrido un error al actualizar la orden',
                        type: 'error'
                    })
                }
            })
        }
    }
  return (
    <>
    <button
        onClick={() => setIsOpen(true)}
        className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200"
    >
        <Pencil className="w-4 h-4" />
    </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-2">
          <div>
              <div className="font-medium text-gray-900">{orderItem.dish}</div>
              <div className="text-sm text-gray-600">{orderItem.category}</div>
          </div>
          <div className="flex items-center gap-2">
              <button
              onClick={() => {
                  if (quantity > 1) {
                      setQuantity(quantity - 1)
                  }
              }}
              className="w-6 h-6 cursor-pointer bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
              >
              -
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-6 h-6 cursor-pointer bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200"
              >
              +
              </button>
          </div>
          </div>
          <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Observaciones (opcional)"
              className="w-full px-2 py-2 h-24 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex items-center justify-center gap-12">
              <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-xs cursor-pointer"
                  onClick={handleUpdateOrderItem}
              >
                  Guardar
              </button>
              <button
                  onClick={() => setIsOpen(false)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-xs cursor-pointer"
              >
                  Cancelar
              </button>
          </div>
      </div>
    </Modal>
    </>
  )
}

export default UpateOrderItem