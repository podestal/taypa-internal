import { useMutation, type UseMutationResult } from "@tanstack/react-query"
import { createTransactionService, type CreateTransaction, type Transaction } from "../../../services/api/transactionService"

export interface CreateTransactionData {
    access: string
    transaction: CreateTransaction
}

const useCreateTransaction = (): UseMutationResult<Transaction, Error, CreateTransactionData> => {
    return useMutation({
        mutationFn: (data: CreateTransactionData) => createTransactionService().post(data.transaction, data.access),
        onSuccess: res => {
            console.log(res);
        },
        onError: err => {
            console.log(err);
        },
    })
}

export default useCreateTransaction