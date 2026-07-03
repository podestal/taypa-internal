import KitchenClient from "./kitchenClient"

export type TransactionType = 'E' | 'I'

export interface KitchenTransaction {
    id: number
    transaction_type: TransactionType
    account: number
    account_name?: string
    amount: number
    category: number | null
    category_name?: string
    description: string
    transaction_date: string
    created_at: string
    updated_at: string
}

export type CreateKitchenTransaction = {
    transaction_type: TransactionType
    account: number
    amount: string | number
    category?: number | null
    description: string
    transaction_date: string
}

export type UpdateKitchenTransaction = CreateKitchenTransaction

export interface KitchenTransactionListParams {
    transaction_type?: TransactionType
    category_id?: string
    start_date?: string
    end_date?: string
    account_id?: string
}

interface Props {
    transactionId?: number
}

const getKitchenTransactionService = ({ transactionId }: Props = {}) => {
    let url = 'transactions/'
    if (transactionId) {
        url += `${transactionId}/`
    }
    return new KitchenClient<KitchenTransaction[], CreateKitchenTransaction, UpdateKitchenTransaction>(url)
}

export default getKitchenTransactionService
