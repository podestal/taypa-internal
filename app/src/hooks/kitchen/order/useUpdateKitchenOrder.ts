import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getKitchenOrderService, {
    type KitchenOrder,
    type UpdateKitchenOrder,
} from "../../../services/kitchen/orderService"

interface UpdateOrderData {
    order: UpdateKitchenOrder
    access: string
}

interface Props {
    orderId: number
}

const useUpdateKitchenOrder = ({ orderId }: Props): UseMutationResult<KitchenOrder, Error, UpdateOrderData> => {
    const service = getKitchenOrderService({ orderId })
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: UpdateOrderData) =>
            service.update(data.order, data.access) as unknown as Promise<KitchenOrder>,
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

export default useUpdateKitchenOrder
