import { AnimatePresence } from "framer-motion"
import useAuthStore from "../../store/useAuthStore"
import useGetOrdersInKitchen from "../../hooks/api/order/useGetOrdersInKitchen"
import KitchenOrderCard from "./KitchenOrderCard"

const KitchenOrderList = () => {
    
    const access = useAuthStore(state => state.access) || ''
    const { data: ordersInKitchen, isLoading, error, isError, isSuccess } = useGetOrdersInKitchen({ access })

    if (isLoading) return <p className="text-center text-gray-500 text-xs animate-pulse">Cargando...</p>
    if (isError) return <p className="text-center text-red-500 text-xs">Error al cargar las órdenes: {error?.message}</p>
    if (isSuccess)
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
        {ordersInKitchen?.map((order, index) => {
            return <KitchenOrderCard key={order.id} order={order} index={index} />
        })}
        </AnimatePresence>
    </div>
  )
}

export default KitchenOrderList