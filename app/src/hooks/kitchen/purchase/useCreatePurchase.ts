import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getPurchaseService, { type Purchase, type CreatePurchase } from "../../../services/kitchen/purchaseService"

interface CreatePurchaseData {
    purchase: CreatePurchase
    access: string
}

const useCreatePurchase = (): UseMutationResult<Purchase, Error, CreatePurchaseData> => {
    const purchaseService = getPurchaseService()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreatePurchaseData) => purchaseService.post(data.purchase, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchases'] })
            queryClient.invalidateQueries({ queryKey: ['inventory-current'] })
            queryClient.invalidateQueries({ queryKey: ['inventory-movements'] })
            queryClient.invalidateQueries({ queryKey: ['inventory-report'] })
            queryClient.invalidateQueries({ queryKey: ['products'] })
            queryClient.invalidateQueries({ queryKey: ['kitchen-accounts'] })
        },
        onError: (error) => {
            console.error('Error creating purchase:', error)
        },
    })
}

export default useCreatePurchase
