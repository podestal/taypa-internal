import { motion } from "framer-motion"
import useGetOrderByStatus from "../../../hooks/api/order/useGetOrderByStatus"
import useAuthStore from "../../../store/useAuthStore"
import OrderByStatusCard from "./OrderByStatusCard"


interface Props {
    status: string
}

const OrderByStatusList = ({ status }: Props) => {

    const access = useAuthStore((state) => state.access) || ''
    const { data: orders, isLoading, error, isError, isSuccess } = useGetOrderByStatus({ access, status })

    if (isLoading) return <p className="text-center text-gray-500 text-xs animate-pulse">Cargando...</p>
    if (isError) return <p className="text-center text-red-500 text-xs">Error al cargar las órdenes {error?.message}</p>
    if (isSuccess)

  return (
    <>
        {orders.length > 0 
        ? 
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {orders?.map((order, index) => (
                    <OrderByStatusCard key={order.id} order={order} index={index} status={status} />
                ))}
            </motion.div>
        : 
        <p className="text-center text-gray-500 text-xs">
            {status === 'IP' ? 'No hay órdenes guardadas' : 
             status === 'IK' ? 'No hay órdenes en la cocina' : 
             status === 'DO' ? 'No hay órdenes entregadas o entregadas a mano' :
             'No hay órdenes pendientes'}
        </p>}
    </>
  )
}

export default OrderByStatusList