import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getPurchaseService, { type Purchase, type UpdatePurchase } from "../../../services/kitchen/purchaseService"

interface UpdatePurchaseData {
    purchase: UpdatePurchase
    access: string
}

interface Props {
    purchaseId: number
}

const useUpdatePurchase = ({ purchaseId }: Props): UseMutationResult<Purchase, Error, UpdatePurchaseData> => {
    const purchaseService = getPurchaseService({ purchaseId })
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdatePurchaseData) => purchaseService.update(data.purchase, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchases'] })
            queryClient.invalidateQueries({ queryKey: ['inventory-current'] })
            queryClient.invalidateQueries({ queryKey: ['inventory-movements'] })
            queryClient.invalidateQueries({ queryKey: ['inventory-report'] })
            queryClient.invalidateQueries({ queryKey: ['products'] })
            queryClient.invalidateQueries({ queryKey: ['kitchen-accounts'] })
        },
        onError: (error) => {
            console.error('Error updating purchase:', error)
        },
    })
}

export default useUpdatePurchase
