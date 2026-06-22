import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { getOrderForBillingService, type OrdersForBillingPage } from "../../../services/api/orderService"

export interface OrdersForBillingFilters {
    status?: string
    date?: string
    start_date?: string
    end_date?: string
}

interface Props {
    access: string
    page: number
    filters?: OrdersForBillingFilters
}

const useGetOrdersForBilling = ({ access, page, filters }: Props): UseQueryResult<OrdersForBillingPage, Error> => {
    const orderService = getOrderForBillingService()
    const params: Record<string, string> = {
        page: page.toString(),
    }

    if (filters) {
        if (filters.status) params.status = filters.status
        if (filters.date) params.date = filters.date
        if (filters.start_date) params.start_date = filters.start_date
        if (filters.end_date) params.end_date = filters.end_date
    }

    return useQuery({
        queryKey: ['orders for billing', page, filters],
        queryFn: () => orderService.get(access, params),
        enabled: !!access,
    })
}

export default useGetOrdersForBilling

