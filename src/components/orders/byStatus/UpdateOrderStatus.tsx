import { Package } from "lucide-react"
import useAuthStore from "../../../store/useAuthStore"
import useUpdateOrder from "../../../hooks/api/order/useUpdateOrder"

interface Props {
    orderId: number
}

const UpdateOrderStatus = ({ orderId }: Props) => {

    const access = useAuthStore((state) => state.access) || ''
    const updateOrder = useUpdateOrder({ orderId })

    const handleUpdateOrder = () => {
        updateOrder.mutate({ access, order: { status: 'PA'}})
    }
  return (
    <div 
        onClick={handleUpdateOrder}
        className="cursor-pointer bg-green-100 rounded-full p-1 hover:bg-green-200 transition-colors duration-300">
        <Package className="w-6 h-6 text-green-600" /> 
    </div>
  )
}

export default UpdateOrderStatus