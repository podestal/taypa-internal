import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getKitchenTransactionService, {
    type KitchenTransaction,
    type UpdateKitchenTransaction,
} from "../../../services/kitchen/transactionService"

interface UpdateTransactionData {
    transaction: UpdateKitchenTransaction
    access: string
}

interface Props {
    transactionId: number
}

const useUpdateKitchenTransaction = ({
    transactionId,
}: Props): UseMutationResult<KitchenTransaction, Error, UpdateTransactionData> => {
    const transactionService = getKitchenTransactionService({ transactionId })
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateTransactionData) => transactionService.update(data.transaction, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchen-transactions'] })
            queryClient.invalidateQueries({ queryKey: ['kitchen-accounts'] })
            queryClient.invalidateQueries({ queryKey: ['finance-report'] })
        },
        onError: (error) => {
            console.error('Error updating transaction:', error)
        },
    })
}

export default useUpdateKitchenTransaction
