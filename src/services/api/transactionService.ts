import APIClient from "./apiClient"

export interface Transaction {
    id: number
    transaction_type: string
    account: number
    amount: number
    category: number
    description: string
    transaction_date: Date
    created_by: number
    created_at: Date
    updated_at: Date
}

export interface TransactionPaginated {
    count: number
    next: string | null
    previous: string | null
    results: Transaction[]
}

export type CreateTransaction = Omit<Transaction, 'id' | 'created_at' | 'updated_at' | 'created_by'>

export type UpdateTransaction = Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at' | 'created_by'>>

const getTransactionService = () => {
    let url = '/transactions/'
    return new APIClient<TransactionPaginated>(url)
}

export default getTransactionService