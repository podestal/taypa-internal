import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { getOrderForBillingService, type OrdersForBillingPage } from "../../../services/api/orderService"

interface Props {
    access: string
    page: number
}

const useGetOrdersForBilling = ({ access, page }: Props): UseQueryResult<OrdersForBillingPage, Error> => {
    const orderService = getOrderForBillingService()
    const params: Record<string, string> = {
        page: page.toString(),
    }

    return useQuery({
        queryKey: ['orders for billing', page],
        queryFn: () => orderService.get(access, params),
        enabled: !!access,
    })
}

export default useGetOrdersForBilling

