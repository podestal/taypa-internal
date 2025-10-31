import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { getOrderByStatusService, type OrderByStatus } from "../../../services/api/orderService"

interface Props {
    access: string
    status: string
}

const useGetOrderByStatus = ({ access, status }: Props): UseQueryResult<OrderByStatus[], Error> => {
    const orderByStatusService = getOrderByStatusService()
    const params: Record<string, string> = {
        status
    }
    return useQuery({
        queryKey: ['orders by status', status],
        queryFn: () => orderByStatusService.get(access, params),
    })
}

export default useGetOrderByStatus