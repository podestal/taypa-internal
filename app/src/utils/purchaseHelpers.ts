import type { CreatePurchase, Purchase, PurchaseListParams } from '../services/kitchen/purchaseService'
import { getFinanceDateRange } from './financeHelpers'
import { normalizeList, todayISO, yesterdayISO } from './inventoryHelpers'

const asRecord = (value: unknown): Record<string, unknown> | null =>
    value && typeof value === 'object' ? (value as Record<string, unknown>) : null

const resolveProductId = (item: Record<string, unknown>) => {
    if (typeof item.product === 'number') return item.product
    const product = asRecord(item.product)
    if (product && typeof product.id === 'number') return product.id
    if (typeof item.product_id === 'number') return item.product_id
    return 0
}

const resolveProductName = (item: Record<string, unknown>) => {
    if (typeof item.product_name === 'string') return item.product_name
    const product = asRecord(item.product)
    if (product && typeof product.name === 'string') return product.name
    return 'Sin nombre'
}

export const normalizePurchases = (data: unknown): Purchase[] =>
    normalizeList<Record<string, unknown>>(data).map(item => {
        const accountRecord = asRecord(item.account)
        return {
            id: Number(item.id ?? 0),
            product: resolveProductId(item),
            product_name: resolveProductName(item),
            account: typeof item.account === 'number'
                ? item.account
                : accountRecord && typeof accountRecord.id === 'number'
                    ? accountRecord.id
                    : Number(item.account_id ?? 0),
            account_name: typeof item.account_name === 'string'
                ? item.account_name
                : accountRecord && typeof accountRecord.name === 'string'
                    ? accountRecord.name
                    : undefined,
            quantity_bought: Number(item.quantity_bought ?? item.quantity ?? 0),
            unit_price: Number(item.unit_price ?? item.price ?? 0),
            transaction: item.transaction != null ? Number(item.transaction) : null,
            notes: String(item.notes ?? ''),
            purchase_date: item.purchase_date != null ? String(item.purchase_date) : undefined,
            created_at: String(item.created_at ?? ''),
            updated_at: String(item.updated_at ?? ''),
        }
    })

export const purchaseTotal = (quantity: number, unitPrice: number) =>
    Number(quantity) * Number(unitPrice)

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

export const buildPurchasePayload = (form: PurchaseFormState): CreatePurchase => {
    const payload: CreatePurchase = {
        product: form.product,
        account: form.account,
        quantity_bought: form.quantity_bought.toFixed(2),
        unit_price: unitPriceFromTotal(form.total_price, form.quantity_bought).toFixed(2),
        purchase_date: form.purchase_date,
    }
    if (form.notes.trim()) {
        payload.notes = form.notes.trim()
    }
    return payload
}

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
