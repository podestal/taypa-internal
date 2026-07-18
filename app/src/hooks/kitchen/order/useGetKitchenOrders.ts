import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getKitchenOrderService, {
    type KitchenOrder,
    type KitchenOrderListParams,
} from "../../../services/kitchen/orderService"
import { normalizeKitchenOrders } from "../../../utils/orderHelpers"

interface Props {
    access: string
    params?: KitchenOrderListParams
}

const useGetKitchenOrders = ({ access, params = {} }: Props): UseQueryResult<KitchenOrder[], Error> => {
    const orderService = getKitchenOrderService()
    return useQuery({
        queryKey: ['kitchen-orders', params],
        queryFn: async () => {
            const queryParams = Object.fromEntries(
                Object.entries(params).filter(([, value]) => value != null && value !== ''),
            ) as Record<string, string>
            return normalizeKitchenOrders(await orderService.get(access, queryParams))
        },
        enabled: Boolean(access),
        retry: false,
    })
}

export default useGetKitchenOrders
