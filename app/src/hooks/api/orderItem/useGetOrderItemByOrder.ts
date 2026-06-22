import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getOrderItemService, { type OrderItem } from "../../../services/api/orderItemService"

interface Props {
    orderId: number
    access: string
}

const useGetOrderItemByOrder = ({ orderId, access }: Props): UseQueryResult<OrderItem[], Error> => {
    const orderItemService = getOrderItemService({ byOrder: true})
    const params: Record<string, string> = {
        order_id: orderId.toString()
    }
    return useQuery({
        queryKey: ['order-items', orderId],
        queryFn: () => orderItemService.get(access, params),
        enabled: !!orderId
    })
}

export default useGetOrderItemByOrder