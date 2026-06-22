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
            // If order status is IK, invalidate kitchen orders query immediately
            if (res.status === 'IK') {
                console.log('[useUpdateOrder] Order status is IK - invalidating and refetching kitchen orders')
                queryClient.invalidateQueries({ queryKey: ['orders-in-kitchen'] })
                queryClient.refetchQueries({ 
                    queryKey: ['orders-in-kitchen'],
                    type: 'active'
                }).then(() => {
                    console.log('[useUpdateOrder] Kitchen orders refetched successfully')
                }).catch((error) => {
                    console.error('[useUpdateOrder] Error refetching kitchen orders:', error)
                })
            }
            // Invalidate orders by status queries
            queryClient.invalidateQueries({ queryKey: ['orders by status', 'IK'] })
            queryClient.invalidateQueries({ queryKey: ['orders by status', 'PA'] })
            queryClient.invalidateQueries({ queryKey: ['orders by status', 'IT'] })
            queryClient.invalidateQueries({ queryKey: ['orders by status', 'DA'] })
            queryClient.invalidateQueries({ queryKey: ['orders by status', 'IP'] })
        },
        onError: (error) => {
            console.error('Error updating order:', error)
        }
    })
}

export default useUpdateOrder