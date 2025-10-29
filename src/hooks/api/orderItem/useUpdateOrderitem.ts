import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import getOrderItemService, { type OrderItem, type CreateUpdateOrderItem } from "../../../services/api/orderItemService"

interface UpdateOrderItemData {
    access: string
    orderItem: CreateUpdateOrderItem
}

interface Props {
    orderItemId: number
    orderId: number
}

const useUpdateOrderitem = ({ orderItemId, orderId }: Props): UseMutationResult<OrderItem, Error, UpdateOrderItemData> => {
    
    const orderItemService = getOrderItemService({ orderItemId })
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: UpdateOrderItemData) => orderItemService.update(data.orderItem, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order-items', orderId] })
        },
        onError: (error) => {
            console.error(error)
        }
    })
}

export default useUpdateOrderitem