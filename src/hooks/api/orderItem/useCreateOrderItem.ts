import { useMutation,type UseMutationResult } from "@tanstack/react-query"
import getOrderItemService, {type OrderItem, type CreateUpdateOrderItem} from "../../../services/api/orderItemService"

export interface CreateOrderItemData {
    access: string
    orderItem: CreateUpdateOrderItem
}

const useCreateOrderItem = (): UseMutationResult<OrderItem, Error, CreateOrderItemData> => {
    const orderItemService = getOrderItemService({})
    return useMutation({
        mutationFn: (data: CreateOrderItemData) => orderItemService.post(data.orderItem, data.access)
        ,
        onSuccess: (data) => {
            console.log('data', data);
            
        },
        onError: (error) => {
            console.error(error)
        }
    })
}

export default useCreateOrderItem