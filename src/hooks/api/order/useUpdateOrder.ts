import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getOrderService, { type Order, type CreateUpdateOrder } from "../../../services/api/orderService"

export interface UpdateOrderData {
    access: string
    order: CreateUpdateOrder
}

interface Props {
    orderId: number
}

const useUpdateOrder = ({ orderId }: Props): UseMutationResult<Order, Error, UpdateOrderData> => {
    const orderService = getOrderService({ orderId })
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: UpdateOrderData) => orderService.update(data.order, data.access),
        onSuccess: res => {
            console.log('Order updated successfully:', res)
            queryClient.invalidateQueries({ queryKey: ['orders by status', 'IK'] })
            queryClient.invalidateQueries({ queryKey: ['orders by status', 'PA'] })
            queryClient.invalidateQueries({ queryKey: ['orders by status', 'IT'] })
            queryClient.invalidateQueries({ queryKey: ['orders by status', 'DA'] })
        },
        onError: (error) => {
            console.error('Error updating order:', error)
        }
    })
}

export default useUpdateOrder