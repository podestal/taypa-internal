import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getOrderService, { type Order } from "../../../services/api/orderService"

interface Props {
    access: string
}
const useGetOrdersInKitchen = ({ access }: Props): UseQueryResult<Order[], Error> => {
    
    const orderService = getOrderService({ inKitchen: true })
    return useQuery({
        queryKey: ['orders-in-kitchen'],
        queryFn: () => orderService.get(access),
    })
}

export default useGetOrdersInKitchen
