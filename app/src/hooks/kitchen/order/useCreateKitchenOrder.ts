import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getKitchenOrderService, {
    type CreateKitchenOrder,
    type KitchenOrder,
} from "../../../services/kitchen/orderService"

interface CreateOrderData {
    order: CreateKitchenOrder
    access: string
}

const invalidateOrderSideEffects = (queryClient: ReturnType<typeof useQueryClient>) => {
    queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] })
    queryClient.invalidateQueries({ queryKey: ['kitchen-accounts'] })
    queryClient.invalidateQueries({ queryKey: ['inventory-current'] })
    queryClient.invalidateQueries({ queryKey: ['inventory-movements'] })
    queryClient.invalidateQueries({ queryKey: ['inventory-report'] })
    queryClient.invalidateQueries({ queryKey: ['kitchen-transactions'] })
    queryClient.invalidateQueries({ queryKey: ['finance-report'] })
}

const useCreateKitchenOrder = (): UseMutationResult<KitchenOrder, Error, CreateOrderData> => {
    const service = getKitchenOrderService()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateOrderData) =>
            service.post(data.order, data.access) as unknown as Promise<KitchenOrder>,
        onSuccess: () => invalidateOrderSideEffects(queryClient),
    })
}

export default useCreateKitchenOrder
