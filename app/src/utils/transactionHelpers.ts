import type {
    CreateKitchenTransaction,
    KitchenTransaction,
    KitchenTransactionListParams,
    TransactionType,
} from '../services/kitchen/transactionService'
import { getFinanceDateRange } from './financeHelpers'
import { normalizeList, todayISO, yesterdayISO } from './inventoryHelpers'

const asRecord = (value: unknown): Record<string, unknown> | null =>
    value && typeof value === 'object' ? (value as Record<string, unknown>) : null

const resolveAccountId = (item: Record<string, unknown>) => {
    if (typeof item.account === 'number') return item.account
    const account = asRecord(item.account)
    if (account && typeof account.id === 'number') return account.id
    return Number(item.account_id ?? 0)
}

const resolveAccountName = (item: Record<string, unknown>) => {
    if (typeof item.account_name === 'string') return item.account_name
    const account = asRecord(item.account)
    if (account && typeof account.name === 'string') return account.name
    return undefined
}

const resolveCategoryId = (item: Record<string, unknown>): number | null => {
    if (item.category === null || item.category === undefined || item.category === '') return null
    if (typeof item.category === 'number') return item.category
    const category = asRecord(item.category)
    if (category && typeof category.id === 'number') return category.id
    if (typeof item.category_id === 'number') return item.category_id
    return null
}

const resolveCategoryName = (item: Record<string, unknown>) => {
    if (typeof item.category_name === 'string') return item.category_name
    const category = asRecord(item.category)
    if (category && typeof category.name === 'string') return category.name
    return undefined
}

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
    E: 'Gasto',
    I: 'Ingreso',
}

export const normalizeKitchenTransactions = (data: unknown): KitchenTransaction[] =>
    normalizeList<Record<string, unknown>>(data).map(item => ({
        id: Number(item.id ?? 0),
        transaction_type: (item.transaction_type === 'I' ? 'I' : 'E') as TransactionType,
        account: resolveAccountId(item),
        account_name: resolveAccountName(item),
        amount: Number(item.amount ?? 0),
        category: resolveCategoryId(item),
        category_name: resolveCategoryName(item),
        description: String(item.description ?? ''),
        transaction_date: String(item.transaction_date ?? ''),
        created_at: String(item.created_at ?? ''),
        updated_at: String(item.updated_at ?? ''),
    }))

export interface TransactionFormState {
    transaction_type: TransactionType
    account: number
    amount: number
    category: number
    description: string
    transaction_date: string
}

export type TransactionDatePreset = 'today' | 'yesterday' | 'custom'

export type TransactionHistoryDatePreset = 'all' | 'today' | 'yesterday' | 'last7days' | 'thisMonth' | 'custom'

export const TRANSACTION_HISTORY_DATE_PRESETS: { id: TransactionHistoryDatePreset; label: string }[] = [
    { id: 'all', label: 'Todas' },
    { id: 'yesterday', label: 'Ayer' },
    { id: 'today', label: 'Hoy' },
    { id: 'last7days', label: 'Últimos 7 días' },
    { id: 'thisMonth', label: 'Este mes' },
]

export interface TransactionHistoryFilters {
    datePreset: TransactionHistoryDatePreset
    start_date: string
    end_date: string
    transaction_type: '' | TransactionType
    category_id: string
    account_id: string
}

export const getDefaultTransactionHistoryFilters = (): TransactionHistoryFilters => ({
    datePreset: 'thisMonth',
    start_date: '',
    end_date: '',
    transaction_type: '',
    category_id: '',
    account_id: '',
})

export const buildTransactionListParams = (
    filters: TransactionHistoryFilters,
): KitchenTransactionListParams => {
    const params: KitchenTransactionListParams = {}

    if (filters.transaction_type) {
        params.transaction_type = filters.transaction_type
    }
    if (filters.category_id) {
        params.category_id = filters.category_id
    }
    if (filters.account_id) {
        params.account_id = filters.account_id
    }

    switch (filters.datePreset) {
        case 'today':
            params.start_date = todayISO()
            params.end_date = todayISO()
            break
        case 'yesterday':
            params.start_date = yesterdayISO()
            params.end_date = yesterdayISO()
            break
        case 'last7days': {
            const range = getFinanceDateRange('last7days')
            params.start_date = range.start_date
            params.end_date = range.end_date
            break
        }
        case 'thisMonth': {
            const range = getFinanceDateRange('thisMonth')
            params.start_date = range.start_date
            params.end_date = range.end_date
            break
        }
        case 'custom':
            if (filters.start_date) params.start_date = filters.start_date
            if (filters.end_date) params.end_date = filters.end_date
            break
        case 'all':
        default:
            break
    }

    return params
}

export const buildTransactionPayload = (
    form: TransactionFormState,
    options?: { includeEmptyCategory?: boolean },
): CreateKitchenTransaction => {
    const payload: CreateKitchenTransaction = {
        transaction_type: form.transaction_type,
        account: form.account,
        amount: form.amount.toFixed(2),
        description: form.description.trim(),
        transaction_date: form.transaction_date,
    }
    if (form.category) {
        payload.category = form.category
    } else if (options?.includeEmptyCategory) {
        payload.category = null
    }
    return payload
}

export const transactionToFormState = (transaction: KitchenTransaction): TransactionFormState => ({
    transaction_type: transaction.transaction_type,
    account: transaction.account,
    amount: transaction.amount,
    category: transaction.category ?? 0,
    description: transaction.description,
    transaction_date: transaction.transaction_date.split('T')[0],
})

export const sortTransactionsDesc = (transactions: KitchenTransaction[]) =>
    [...transactions].sort((a, b) => {
        const dateCmp = b.transaction_date.localeCompare(a.transaction_date)
        if (dateCmp !== 0) return dateCmp
        return b.id - a.id
    })
