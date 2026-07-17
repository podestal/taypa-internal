import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getKitchenOrderService, { type KitchenOrder } from "../../../services/kitchen/orderService"
import { normalizeKitchenOrders } from "../../../utils/orderHelpers"

interface Props {
    access: string
}

const useGetKitchenOrders = ({ access }: Props): UseQueryResult<KitchenOrder[], Error> => {
    const orderService = getKitchenOrderService()
    return useQuery({
        queryKey: ['kitchen-orders'],
        queryFn: async () => normalizeKitchenOrders(await orderService.get(access)),
        enabled: Boolean(access),
        retry: false,
    })
}

export default useGetKitchenOrders
