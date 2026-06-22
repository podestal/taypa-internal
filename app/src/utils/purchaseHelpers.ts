import type { Purchase } from '../services/kitchen/purchaseService'
import { normalizeList } from './inventoryHelpers'

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
            created_at: String(item.created_at ?? ''),
            updated_at: String(item.updated_at ?? ''),
        }
    })

export const purchaseTotal = (quantity: number, unitPrice: number) =>
    Number(quantity) * Number(unitPrice)

export interface PurchaseFormState {
    product: number
    account: number
    quantity_bought: number
    total_price: number
    notes: string
}

export const unitPriceFromTotal = (totalPrice: number, quantity: number) => {
    if (!quantity || quantity <= 0) return 0
    return Math.round((totalPrice / quantity) * 100) / 100
}
