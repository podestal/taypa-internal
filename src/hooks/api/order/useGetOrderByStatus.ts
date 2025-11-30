import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { getOrderByStatusService, type OrderByStatus } from "../../../services/api/orderService"

interface Props {
    access: string
    status: string
}

const useGetOrderByStatus = ({ access, status }: Props): UseQueryResult<OrderByStatus[], Error> => {
    const orderByStatusService = getOrderByStatusService()
    
    return useQuery({
        queryKey: ['orders by status', status],
        queryFn: async () => {
            // For 'DO' status, also fetch 'HA' orders
            if (status === 'DO') {
                const [doOrders, haOrders] = await Promise.all([
                    orderByStatusService.get(access, { status: 'DO' }),
                    orderByStatusService.get(access, { status: 'HA' })
                ])
                // Combine and return both arrays
                return [...doOrders, ...haOrders]
            } else {
                // For other statuses, fetch normally
                return orderByStatusService.get(access, { status })
            }
        },
    })
}

export default useGetOrderByStatus