import { AnimatePresence, motion } from "framer-motion"
import useGetOrderItemByOrder from "../../hooks/api/orderItem/useGetOrderItemByOrder"
import useAuthStore from "../../store/useAuthStore"
import { ShoppingCart } from "lucide-react"
import OrderItemCard from "./OrderItemCard"

interface Props {
    orderId: number
}


const OrderItemList = ({ orderId }: Props) => {

    const access = useAuthStore(state => state.access) || ''
    const { data: orderItems, isLoading, error, isError, isSuccess } = useGetOrderItemByOrder({ orderId, access })

    if (isLoading) return <p className="text-gray-500 text-xs text-center my-4 animate-pulse">Cargando...</p>
    if (isError) return <p className="text-red-500 text-xs text-center my-4">Error al cargar los items de la orde {error.message}n</p>
    // if (isSuccess && !orderItems || orderItems?.length === 0) return 

    if (isSuccess) return (
        <>
        {orderItems.length > 0 
        ? 
        <div className="space-y-3">
                <AnimatePresence>
                  {orderItems.map((item, index) => (
                    <OrderItemCard key={item.id} orderItem={item} orderId={orderId} index={index}/>
                  ))}
                </AnimatePresence>
                
                <div className="mt-4 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {/* ${currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0)} */}
                    </span>
                  </div>
                  <motion.button
                    // onClick={createOrderInternal}
                    className="w-full mt-3 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Mandar a Cocina
                  </motion.button>
                </div>
              </div> 
              : 
              <div className="text-center text-gray-500 py-8">
                <>{console.log('orderItems', orderItems)}</>
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No hay artículos en la orden</p>
                <p className="text-sm">Selecciona una categoría y agrega artículos</p>
             </div>
              }
        </>
    )
}
export default OrderItemList