import { useMutation, type UseMutationResult } from "@tanstack/react-query"
import getOrderService, { type Order } from "../../../services/api/orderService"

export interface RemoveOrderData {
    access: string
}

interface Props {
    orderId: number
}

const useRemoveOrder = ({ orderId }: Props): UseMutationResult<Order, Error, RemoveOrderData> => {
    const orderService = getOrderService({ orderId })
    return useMutation({
        mutationFn: (data: RemoveOrderData) => orderService.delete(data.access),
        onSuccess: (data) => {
            console.log('order removed', data);
        },
        onError: (error) => {
            console.error(error)
        }
    })
}

export default useRemoveOrder