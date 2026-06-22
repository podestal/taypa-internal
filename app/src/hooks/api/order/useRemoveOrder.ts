import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getOrderService, { type Order } from "../../../services/api/orderService"

export interface RemoveOrderData {
    access: string
}

interface Props {
    orderId: number
}

const useRemoveOrder = ({ orderId }: Props): UseMutationResult<Order, Error, RemoveOrderData> => {
    const queryClient = useQueryClient()
    const orderService = getOrderService({ orderId })
    return useMutation({
        mutationFn: (data: RemoveOrderData) => orderService.delete(data.access),
        onSuccess: (data) => {
            console.log('order removed', data);
            queryClient.invalidateQueries({ queryKey: ['orders by status', 'IP'] })
        },
        onError: (error) => {
            console.error(error)
        }
    })
}

export default useRemoveOrder