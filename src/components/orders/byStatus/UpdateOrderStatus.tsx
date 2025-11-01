import { CheckCircle, Package, Truck } from "lucide-react"
import useAuthStore from "../../../store/useAuthStore"
import useUpdateOrder from "../../../hooks/api/order/useUpdateOrder"

interface Props {
    orderId: number
    orderStatus: string
}

const UpdateOrderStatus = ({ orderId, orderStatus }: Props) => {

    const access = useAuthStore((state) => state.access) || ''
    const updateOrder = useUpdateOrder({ orderId })

    const handleUpdateOrder = () => {
        const newStatus = orderStatus === 'IK' ? 'PA' : orderStatus === 'PA' ? 'IT' : orderStatus === 'IT' ? 'DO' : ''
        console.log(newStatus)
        updateOrder.mutate({ access, order: { status: newStatus}})
    }
  return (
    <div 
        onClick={handleUpdateOrder}
        className="cursor-pointer bg-green-100 rounded-full p-1 hover:bg-green-200 transition-colors duration-300">
        {orderStatus === 'IK' && <Package className="w-6 h-6 text-green-600" /> }
        {orderStatus === 'PA' && <Truck className="w-6 h-6 text-green-600" /> }
        {orderStatus === 'IT' && <CheckCircle className="w-6 h-6 text-green-600" /> }
    </div>
  )
}

export default UpdateOrderStatus