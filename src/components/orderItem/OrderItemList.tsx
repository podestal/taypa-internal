import { AnimatePresence, motion } from "framer-motion"
import useGetOrderItemByOrder from "../../hooks/api/orderItem/useGetOrderItemByOrder"
import useAuthStore from "../../store/useAuthStore"
import { ShoppingCart, XCircle } from "lucide-react"

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
            <>{console.log(orderItems)}</>
                <AnimatePresence>
                  {orderItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        
                        <div>
                          <div className="font-medium text-gray-900">{item.dish}</div>
                          <div className="text-sm text-gray-600">{item.category}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            // onClick={() => updateItemQuantity(index, item.quantity - 1)}
                            className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            // onClick={() => updateItemQuantity(index, item.quantity + 1)}
                            className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200"
                          >
                            +
                          </button>
                          <motion.button
                            // onClick={() => removeItemFromOrder(index)}
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
                        value={item.observation}
                        // onChange={(e) => updateItemObservations(index, e.target.value)}
                        placeholder="Observaciones (opcional)"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="text-sm text-gray-600 mt-1">
                        Subtotal: ${item.price}
                      </div>
                    </motion.div>
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