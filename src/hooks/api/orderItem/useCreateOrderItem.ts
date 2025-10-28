import { useMutation,type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getOrderItemService, {type OrderItem, type CreateUpdateOrderItem} from "../../../services/api/orderItemService"

export interface CreateOrderItemData {
    access: string
    orderItem: CreateUpdateOrderItem
}

const useCreateOrderItem = (): UseMutationResult<OrderItem, Error, CreateOrderItemData> => {
    const orderItemService = getOrderItemService({})
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateOrderItemData) => orderItemService.post(data.orderItem, data.access)
        ,
        onSuccess: (data) => {
            console.log('data', data);
            queryClient.invalidateQueries({ queryKey: ['order-items', data.order] })
        },
        onError: (error) => {
            console.error(error)
        }
    })
}

export default useCreateOrderItem