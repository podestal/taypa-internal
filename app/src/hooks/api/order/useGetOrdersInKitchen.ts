import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { type OrderInKitchen, getOrderInKitchenService } from "../../../services/api/orderService"

interface Props {
    access: string
}

const useGetOrdersInKitchen = ({ access }: Props): UseQueryResult<OrderInKitchen[], Error> => {
    const orderService = getOrderInKitchenService()
    return useQuery({
        queryKey: ['orders-in-kitchen'],
        queryFn: () => orderService.get(access),
    })
}

export default useGetOrdersInKitchen
