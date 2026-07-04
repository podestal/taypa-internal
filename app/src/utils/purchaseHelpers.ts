import type {
    CreatePurchase,
    Purchase,
    PurchaseListParams,
    PurchaseTransaction,
} from '../services/kitchen/purchaseService'
import { getFinanceDateRange } from './financeHelpers'
import { normalizeList, todayISO, yesterdayISO } from './inventoryHelpers'

const asRecord = (value: unknown): Record<string, unknown> | null =>
    value && typeof value === 'object' ? (value as Record<string, unknown>) : null

const toId = (value: unknown): number | null => {
    if (typeof value === 'number' && !Number.isNaN(value)) return value
    if (typeof value === 'string' && value !== '') {
        const parsed = Number(value)
        return Number.isNaN(parsed) ? null : parsed
    }
    return null
}

const resolveProductId = (item: Record<string, unknown>) => {
    const fromProductId = toId(item.product_id)
    if (fromProductId != null) return fromProductId
    const fromProduct = toId(item.product)
    if (fromProduct != null) return fromProduct
    const product = asRecord(item.product)
    if (product) {
        const nested = toId(product.id)
        if (nested != null) return nested
    }
    return 0
}

const resolveProductName = (item: Record<string, unknown>) => {
    if (typeof item.product_name === 'string') return item.product_name
    const product = asRecord(item.product)
    if (product && typeof product.name === 'string') return product.name
    return undefined
}

const resolveAccountId = (item: Record<string, unknown>) => {
    const fromAccountId = toId(item.account_id)
    if (fromAccountId != null) return fromAccountId
    const fromAccount = toId(item.account)
    if (fromAccount != null) return fromAccount
    const account = asRecord(item.account)
    if (account) {
        const nested = toId(account.id)
        if (nested != null) return nested
    }
    return 0
}

const resolveAccountName = (item: Record<string, unknown>) => {
    if (typeof item.account_name === 'string') return item.account_name
    const account = asRecord(item.account)
    if (account && typeof account.name === 'string') return account.name
    return undefined
}

const normalizePurchaseTransaction = (value: unknown): PurchaseTransaction | null => {
    if (value == null) return null
    if (typeof value === 'number') {
        return { id: value, transaction_type: 'E', amount: '0', account: 0, description: '' }
    }
    const record = asRecord(value)
    if (!record) return null

    const accountRecord = asRecord(record.account)
    const accountId = toId(record.account) ?? toId(accountRecord?.id) ?? 0
    const accountName = typeof record.account_name === 'string'
        ? record.account_name
        : accountRecord && typeof accountRecord.name === 'string'
            ? accountRecord.name
            : undefined

    return {
        id: Number(record.id ?? 0),
        transaction_type: String(record.transaction_type ?? 'E'),
        amount: String(record.amount ?? '0'),
        account: accountId,
        account_name: accountName,
        description: String(record.description ?? ''),
    }
}

export const normalizePurchases = (data: unknown): Purchase[] =>
    normalizeList<Record<string, unknown>>(data).map(item => {
        const transaction = normalizePurchaseTransaction(item.transaction)
        const quantity = Number(item.quantity_bought ?? item.quantity ?? 0)
        const unitPrice = Number(item.unit_price ?? item.price ?? 0)
        const account = resolveAccountId(item) || transaction?.account || 0
        const accountName = resolveAccountName(item) ?? transaction?.account_name

        const totalFromApi = item.total_price != null
            ? Number(item.total_price)
            : item.total != null
                ? Number(item.total)
                : transaction?.amount
                    ? Number(transaction.amount)
                    : quantity * unitPrice

        return {
            id: Number(item.id ?? 0),
            product: resolveProductId(item),
            product_name: resolveProductName(item),
            account,
            account_name: accountName,
            quantity_bought: quantity,
            unit_price: unitPrice,
            total: totalFromApi,
            transaction,
            notes: String(item.notes ?? ''),
            purchase_date: item.purchase_date != null ? String(item.purchase_date) : undefined,
            created_at: String(item.created_at ?? ''),
            updated_at: String(item.updated_at ?? ''),
        }
    })

export const purchaseTotal = (quantity: number, unitPrice: number) =>
    Number(quantity) * Number(unitPrice)

export const getPurchaseTotal = (purchase: Purchase) => purchase.total

export type PurchaseDatePreset = 'today' | 'yesterday' | 'custom'

export interface PurchaseFormState {
    product: number
    account: number
    quantity_bought: number
    total_price: number
    purchase_date: string
    notes: string
}

export const unitPriceFromTotal = (totalPrice: number, quantity: number) => {
    if (!quantity || quantity <= 0) return 0
    return Math.round((totalPrice / quantity) * 100) / 100
}

export const buildPurchasePayload = (form: PurchaseFormState): CreatePurchase => ({
    product: form.product,
    account: form.account,
    quantity_bought: form.quantity_bought.toFixed(2),
    total: form.total_price.toFixed(2),
    purchase_date: form.purchase_date,
    notes: form.notes.trim(),
})

export const purchaseToFormState = (purchase: Purchase): PurchaseFormState => ({
    product: purchase.product,
    account: purchase.account || purchase.transaction?.account || 0,
    quantity_bought: purchase.quantity_bought,
    total_price: getPurchaseTotal(purchase),
    purchase_date: (purchase.purchase_date ?? purchase.created_at).split('T')[0],
    notes: purchase.notes ?? '',
})

export type PurchaseHistoryDatePreset = 'all' | 'today' | 'yesterday' | 'last7days' | 'thisMonth' | 'custom'

export const PURCHASE_HISTORY_DATE_PRESETS: { id: PurchaseHistoryDatePreset; label: string }[] = [
    { id: 'all', label: 'Todas' },
    { id: 'yesterday', label: 'Ayer' },
    { id: 'today', label: 'Hoy' },
    { id: 'last7days', label: 'Últimos 7 días' },
    { id: 'thisMonth', label: 'Este mes' },
]

export interface PurchaseHistoryFilters {
    datePreset: PurchaseHistoryDatePreset
    start_date: string
    end_date: string
    product_id: string
    account_id: string
}

export const getDefaultPurchaseHistoryFilters = (): PurchaseHistoryFilters => ({
    datePreset: 'yesterday',
    start_date: '',
    end_date: '',
    product_id: '',
    account_id: '',
})

export const buildPurchaseListParams = (filters: PurchaseHistoryFilters): PurchaseListParams => {
    const params: PurchaseListParams = {}

    if (filters.product_id) {
        params.product_id = filters.product_id
    }
    if (filters.account_id) {
        params.account_id = filters.account_id
    }

    switch (filters.datePreset) {
        case 'today':
            params.date = todayISO()
            break
        case 'yesterday':
            params.date = yesterdayISO()
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
            if (filters.start_date && filters.end_date) {
                if (filters.start_date === filters.end_date) {
                    params.date = filters.start_date
                } else {
                    params.start_date = filters.start_date
                    params.end_date = filters.end_date
                }
            }
            break
        case 'all':
        default:
            break
    }

    return params
}

export const sortPurchasesByDateDesc = (purchases: Purchase[]) =>
    [...purchases].sort((a, b) => {
        const dateA = a.purchase_date ?? a.created_at
        const dateB = b.purchase_date ?? b.created_at
        return dateB.localeCompare(dateA)
    })
