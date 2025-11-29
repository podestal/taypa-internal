import { motion } from "framer-motion"
import type { OrderByStatus } from "../../../services/api/orderService"
import getTimeElapsed from "../../../utils/getTimeElapsed"
import formatTimer from "../../../utils/formatTimer"
import getTimeColor from "../../../utils/getTimeColor"
import { useEffect, useState } from "react"
import UpdateOrderStatus from "./UpdateOrderStatus"
import Modal from "../../ui/Modal"
import useRemoveOrder from "../../../hooks/api/order/useRemoveOrder"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationStore from "../../../store/useNotificationStore"
import { useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"

interface Props {
    order: OrderByStatus
    index: number
    status: string
}

const OrderByStatusCard = ({ order, index, status }: Props) => {
    const [currentTime, setCurrentTime] = useState(new Date())
    const timeElapsed = getTimeElapsed(currentTime, order.updated_at)
    const [showMore, setShowMore] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const access = useAuthStore(state => state.access) || ''
    const removeOrder = useRemoveOrder({ orderId: order.id })
    const addNotification = useNotificationStore(state => state.addNotification)
    const queryClient = useQueryClient()

    const isGuardadas = status === 'IP'

    useEffect(() => {
        if (!isGuardadas) {
            const timer = setInterval(() => {
              setCurrentTime(new Date())
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [isGuardadas])

    const handleDeleteOrder = () => {
        removeOrder.mutate({ access }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['orders by status', status] })
                addNotification({
                    title: 'Orden eliminada',
                    message: 'La orden ha sido eliminada correctamente',
                    type: 'success',
                })
                setShowDeleteConfirm(false)
            },
            onError: (error) => {
                console.error(error)
                addNotification({
                    title: 'Error',
                    message: 'Error al eliminar la orden',
                    type: 'error',
                })
            }
        })
    }

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
            {!isGuardadas && order.status !== 'DO' && (
                <div className={`px-2 py-1 rounded text-sm font-bold ${getTimeColor(timeElapsed)}`}>
                    {formatTimer(timeElapsed)}
                </div>
            )}
            {isGuardadas && (
                <motion.button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={removeOrder.isPending}
                >
                    <Trash2 className="w-4 h-4" />
                </motion.button>
            )}
        </div>
        
        <div className="text-sm text-gray-600 mb-2">
            {order.customer_name}
        </div>
        <div className="text-xs text-gray-600">
            <strong>Dir:</strong> {order.address_info}
        </div>
        
        <div className="flex justify-between items-center mt-4 mb-2">
            {!isGuardadas && <UpdateOrderStatus orderId={order.id} orderStatus={order.status} orderType={order.order_type} />}
            <motion.button
                onClick={() => setShowMore(true)}
                className={`flex items-center ${isGuardadas ? 'justify-start' : 'justify-end'} cursor-pointer text-blue-600 hover:text-blue-800 text-sm font-medium`}
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
    <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-center">¿Estás seguro de querer eliminar esta orden?</h2>
            <p className="text-gray-600 text-center">Esta acción no se puede deshacer.</p>
            <div className="flex justify-center gap-4">
                <motion.button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 cursor-pointer transition-colors font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={removeOrder.isPending}
                >
                    Cancelar
                </motion.button>
                <motion.button
                    onClick={handleDeleteOrder}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 cursor-pointer transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={removeOrder.isPending}
                >
                    {removeOrder.isPending ? 'Eliminando...' : 'Eliminar'}
                </motion.button>
            </div>
        </div>
    </Modal>
    </>
  )
}

export default OrderByStatusCard