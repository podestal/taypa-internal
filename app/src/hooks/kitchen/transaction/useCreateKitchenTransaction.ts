import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getKitchenTransactionService, {
    type CreateKitchenTransaction,
    type KitchenTransaction,
} from "../../../services/kitchen/transactionService"

interface CreateTransactionData {
    transaction: CreateKitchenTransaction
    access: string
}

const useCreateKitchenTransaction = (): UseMutationResult<KitchenTransaction, Error, CreateTransactionData> => {
    const transactionService = getKitchenTransactionService()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateTransactionData) => transactionService.post(data.transaction, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchen-transactions'] })
            queryClient.invalidateQueries({ queryKey: ['kitchen-accounts'] })
            queryClient.invalidateQueries({ queryKey: ['finance-report'] })
        },
        onError: (error) => {
            console.error('Error creating transaction:', error)
        },
    })
}

export default useCreateKitchenTransaction
