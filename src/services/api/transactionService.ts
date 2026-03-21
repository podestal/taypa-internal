import APIClient from "./apiClient"

const baseUrl = '/transactions/'

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

export interface TransactionStatsMeta {
    currency: string
    timezone: string
    period: 'today' | 'last7days' | 'thisWeek' | 'thisMonth' | 'year' | 'custom' | 'all'
    granularity: 'day' | 'week' | 'month' | 'year'
    start_date: string
    end_date: string
}

export interface TransactionStatsTotals {
    income: number
    expense: number
    net: number
}

export interface IncomeExpenseBucket {
    date: string
    income: number
    expense: number
    net: number
}

export interface CategoryStat {
    category_id: number
    category_name: string
    value: number
    percentage: number
}

export interface TransactionStatsResponse {
    meta: TransactionStatsMeta
    totals: TransactionStatsTotals
    income_vs_expense_by_day: IncomeExpenseBucket[]
    income_by_category?: CategoryStat[]
    expense_by_category: CategoryStat[]
}

export type CreateTransaction = Omit<Transaction, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'transaction_date'> & {
    transaction_date: string
}

export const createTransactionService = () => {
    
    return new APIClient<Transaction, CreateTransaction>(baseUrl)
}

export type UpdateTransaction = Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at' | 'created_by'>>

const getTransactionService = () => {
    return new APIClient<TransactionPaginated>(baseUrl)
}

export const getTransactionStatsService = () => {
    return new APIClient<TransactionStatsResponse>(`${baseUrl}stats/`)
}

export default getTransactionService