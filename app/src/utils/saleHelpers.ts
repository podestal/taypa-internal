import type { Sale, SaleTransaction, SaleToppingLine } from '../services/kitchen/saleService'
import type { SaleListParams } from '../services/kitchen/saleService'
import type { KitchenTopping } from '../services/kitchen/toppingService'
import { getFinanceDateRange } from './financeHelpers'
import { normalizeList, todayISO, yesterdayISO } from './inventoryHelpers'

const asRecord = (value: unknown): Record<string, unknown> | null =>
    value && typeof value === 'object' ? (value as Record<string, unknown>) : null

const resolveDishId = (item: Record<string, unknown>) => {
    if (typeof item.dish === 'number') return item.dish
    const dish = asRecord(item.dish)
    if (dish && typeof dish.id === 'number') return dish.id
    if (typeof item.dish_id === 'number') return item.dish_id
    return 0
}

const resolveDishName = (item: Record<string, unknown>) => {
    if (typeof item.dish_name === 'string') return item.dish_name
    const dish = asRecord(item.dish)
    if (dish && typeof dish.name === 'string') return dish.name
    return undefined
}

const normalizeTransaction = (value: unknown): SaleTransaction | null => {
    if (value == null) return null
    if (typeof value === 'number') {
        return { id: value, transaction_type: 'I', amount: '0', account: 0, description: '' }
    }
    const record = asRecord(value)
    if (!record) return null
    return {
        id: Number(record.id ?? 0),
        transaction_type: String(record.transaction_type ?? 'I'),
        amount: String(record.amount ?? '0'),
        account: Number(record.account ?? 0),
        description: String(record.description ?? ''),
    }
}

const normalizeSaleTopping = (value: unknown): SaleToppingLine | null => {
    const record = asRecord(value)
    if (!record) return null

    const toppingId = typeof record.topping === 'number'
        ? record.topping
        : asRecord(record.topping)?.id != null
            ? Number(asRecord(record.topping)?.id)
            : Number(record.topping_id ?? 0)

    const quantity = Number(record.quantity ?? 0)
    const unitPrice = Number(record.unit_price ?? record.price ?? 0)

    return {
        id: record.id != null ? Number(record.id) : undefined,
        topping: toppingId,
        topping_name: typeof record.topping_name === 'string'
            ? record.topping_name
            : asRecord(record.topping)?.name != null
                ? String(asRecord(record.topping)?.name)
                : undefined,
        quantity,
        unit_price: unitPrice || undefined,
        subtotal: record.subtotal != null
            ? Number(record.subtotal)
            : unitPrice ? quantity * unitPrice : undefined,
    }
}

const normalizeSaleToppings = (value: unknown): SaleToppingLine[] => {
    if (!Array.isArray(value)) return []
    return value.map(normalizeSaleTopping).filter((item): item is SaleToppingLine => item != null)
}

const toSale = (item: Record<string, unknown>): Sale => {
    const quantity = Number(item.quantity_sold ?? 0)
    const unitPrice = Number(item.unit_price ?? 0)
    const subtotal = item.subtotal != null
        ? Number(item.subtotal)
        : quantity * unitPrice

    return {
        id: Number(item.id ?? 0),
        dish: resolveDishId(item),
        dish_name: resolveDishName(item),
        quantity_sold: quantity,
        unit_price: unitPrice,
        subtotal,
        notes: String(item.notes ?? ''),
        sale_date: item.sale_date != null ? String(item.sale_date) : undefined,
        toppings: normalizeSaleToppings(item.toppings),
        transaction: normalizeTransaction(item.transaction),
        created_at: String(item.created_at ?? ''),
        updated_at: String(item.updated_at ?? ''),
    }
}

export const normalizeSales = (data: unknown): Sale[] =>
    normalizeList<Record<string, unknown>>(data).map(toSale)

export const normalizeSale = (data: unknown): Sale => {
    const record = asRecord(data)
    if (!record) {
        return {
            id: 0,
            dish: 0,
            quantity_sold: 0,
            unit_price: 0,
            subtotal: 0,
            notes: '',
            toppings: [],
            transaction: null,
            created_at: '',
            updated_at: '',
        }
    }
    return toSale(record)
}

export const saleSubtotal = (quantity: number, unitPrice: number) =>
    Math.round(Number(quantity) * Number(unitPrice) * 100) / 100

export interface SaleFormTopping {
    topping: number
    quantity: number
}

export type SaleDatePreset = 'today' | 'yesterday' | 'custom'

export interface SaleFormState {
    dish: number
    account: number
    quantity_sold: number
    unit_price: number
    sale_date: string
    notes: string
    toppings: SaleFormTopping[]
}

export const toppingsSubtotal = (
    lines: SaleFormTopping[],
    availableToppings: KitchenTopping[],
) => lines.reduce((sum, line) => {
    const topping = availableToppings.find(t => t.id === line.topping)
    if (!topping || !line.quantity) return sum
    return sum + saleSubtotal(line.quantity, topping.price)
}, 0)

export const saleTotal = (
    form: SaleFormState,
    availableToppings: KitchenTopping[],
) => saleSubtotal(form.quantity_sold, form.unit_price)
    + toppingsSubtotal(form.toppings, availableToppings)

export const buildSalePayload = (form: SaleFormState) => {
    const payload: {
        dish: number
        account: number
        quantity_sold: string
        sale_date: string
        unit_price?: string
        notes?: string
        toppings?: { topping: number; quantity: string }[]
    } = {
        dish: form.dish,
        account: form.account,
        quantity_sold: form.quantity_sold.toFixed(2),
        sale_date: form.sale_date,
    }

    if (form.unit_price > 0) {
        payload.unit_price = form.unit_price.toFixed(2)
    }

    if (form.notes.trim()) {
        payload.notes = form.notes.trim()
    }

    const validToppings = form.toppings.filter(line => line.topping > 0 && line.quantity > 0)
    if (validToppings.length > 0) {
        payload.toppings = validToppings.map(line => ({
            topping: line.topping,
            quantity: line.quantity.toFixed(2),
        }))
    }

    return payload
}

export type SaleHistoryDatePreset = 'all' | 'today' | 'yesterday' | 'last7days' | 'thisMonth' | 'custom'

export const SALE_HISTORY_DATE_PRESETS: { id: SaleHistoryDatePreset; label: string }[] = [
    { id: 'all', label: 'Todas' },
    { id: 'yesterday', label: 'Ayer' },
    { id: 'today', label: 'Hoy' },
    { id: 'last7days', label: 'Últimos 7 días' },
    { id: 'thisMonth', label: 'Este mes' },
]

export interface SaleHistoryFilters {
    datePreset: SaleHistoryDatePreset
    start_date: string
    end_date: string
    dish_id: string
    category_id: string
}

export const getDefaultSaleHistoryFilters = (): SaleHistoryFilters => ({
    datePreset: 'yesterday',
    start_date: '',
    end_date: '',
    dish_id: '',
    category_id: '',
})

export const buildSaleListParams = (filters: SaleHistoryFilters): SaleListParams => {
    const params: SaleListParams = {}

    if (filters.dish_id) {
        params.dish_id = filters.dish_id
    }
    if (filters.category_id) {
        params.category_id = filters.category_id
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

export const sortSalesByDateDesc = <T extends { sale_date?: string; created_at: string }>(sales: T[]) =>
    [...sales].sort((a, b) => {
        const dateA = a.sale_date ?? a.created_at
        const dateB = b.sale_date ?? b.created_at
        return dateB.localeCompare(dateA)
    })
