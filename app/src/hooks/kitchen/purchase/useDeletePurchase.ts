import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getPurchaseService, { type Purchase } from "../../../services/kitchen/purchaseService"

interface DeletePurchaseData {
    access: string
}

interface Props {
    purchaseId: number
}

const useDeletePurchase = ({ purchaseId }: Props): UseMutationResult<Purchase, Error, DeletePurchaseData> => {
    const purchaseService = getPurchaseService({ purchaseId })
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: DeletePurchaseData) => purchaseService.delete(data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchases'] })
            queryClient.invalidateQueries({ queryKey: ['inventory-current'] })
            queryClient.invalidateQueries({ queryKey: ['inventory-movements'] })
            queryClient.invalidateQueries({ queryKey: ['inventory-report'] })
        },
        onError: (error) => {
            console.error('Error deleting purchase:', error)
        },
    })
}

export default useDeletePurchase
