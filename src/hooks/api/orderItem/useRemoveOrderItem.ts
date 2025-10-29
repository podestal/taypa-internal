import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import getOrderItemService, { type OrderItem } from "../../../services/api/orderItemService"

interface RemoveOrderItemData {
    access: string
}

interface Props {
    orderItemId: number
    orderId: number
}

const useRemoveOrderItem = ({ orderItemId, orderId }: Props): UseMutationResult<OrderItem, Error, RemoveOrderItemData> => {
    const queryClient = useQueryClient()
    const orderItemService = getOrderItemService({ orderItemId })
    return useMutation({
        mutationFn: (data: RemoveOrderItemData) => orderItemService.delete(data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order-items', orderId] })
        },
        onError: (error) => {
            console.error(error)
        }
    })
}

export default useRemoveOrderItem