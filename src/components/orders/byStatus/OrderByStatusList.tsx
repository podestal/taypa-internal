import useGetOrderByStatus from "../../../hooks/api/order/useGetOrderByStatus"
import useAuthStore from "../../../store/useAuthStore"


const OrderByStatusList = () => {

    const access = useAuthStore((state) => state.access) || ''
    const { data: orders, isLoading, error } = useGetOrderByStatus({ access, status: 'IK' })
  return (
    <div><>{console.log('orders',orders)}</></div>
  )
}

export default OrderByStatusList