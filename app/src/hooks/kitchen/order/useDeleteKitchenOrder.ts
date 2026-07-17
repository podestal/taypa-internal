import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getKitchenOrderService, { type KitchenOrder } from "../../../services/kitchen/orderService"

interface DeleteOrderData {
    access: string
}

interface Props {
    orderId: number
}

const useDeleteKitchenOrder = ({ orderId }: Props): UseMutationResult<KitchenOrder, Error, DeleteOrderData> => {
    const service = getKitchenOrderService({ orderId })
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: DeleteOrderData) =>
            service.delete(data.access) as unknown as Promise<KitchenOrder>,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] })
            queryClient.invalidateQueries({ queryKey: ['kitchen-accounts'] })
            queryClient.invalidateQueries({ queryKey: ['inventory-current'] })
            queryClient.invalidateQueries({ queryKey: ['inventory-movements'] })
            queryClient.invalidateQueries({ queryKey: ['inventory-report'] })
            queryClient.invalidateQueries({ queryKey: ['kitchen-transactions'] })
            queryClient.invalidateQueries({ queryKey: ['finance-report'] })
        },
    })
}

export default useDeleteKitchenOrder
