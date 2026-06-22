import type {
    CurrentStockItem,
    InventoryMovement,
    InventoryReportItem,
    MovementSource,
    MovementType,
} from '../services/kitchen/inventoryService'

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
    IN: 'Entrada',
    OUT: 'Salida',
}

export const MOVEMENT_SOURCE_LABELS: Record<MovementSource, string> = {
    PURCHASE: 'Compra',
    USAGE: 'Uso',
    WASTE: 'Merma',
    ADJUSTMENT: 'Ajuste',
}

export const MANUAL_MOVEMENT_SOURCES: MovementSource[] = ['USAGE', 'WASTE', 'ADJUSTMENT']

export const formatDecimal = (value: number | string | null | undefined) => {
    if (value === null || value === undefined || value === '') return '—'
    const parsed = Number(value)
    if (Number.isNaN(parsed)) return '—'
    return parsed.toLocaleString('es-PE', { maximumFractionDigits: 2 })
}

export const formatDate = (value: string) => {
    if (!value) return '—'
    const date = new Date(value.includes('T') ? value : `${value}T00:00:00`)
    if (Number.isNaN(date.getTime())) return '—'
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const todayISO = () => new Date().toISOString().split('T')[0]

export const daysAgoISO = (days: number) => {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date.toISOString().split('T')[0]
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
    value && typeof value === 'object' ? (value as Record<string, unknown>) : null

export const normalizeList = <T>(data: unknown): T[] => {
    if (Array.isArray(data)) return data
    const record = asRecord(data)
    if (record && Array.isArray(record.results)) return record.results as T[]
    return []
}

const resolveProductId = (item: Record<string, unknown>) => {
    if (typeof item.product_id === 'number') return item.product_id
    if (typeof item.product === 'number') return item.product
    const product = asRecord(item.product)
    if (product && typeof product.id === 'number') return product.id
    if (typeof item.id === 'number') return item.id
    return 0
}

const resolveProductName = (item: Record<string, unknown>) => {
    if (typeof item.product_name === 'string') return item.product_name
    const product = asRecord(item.product)
    if (product && typeof product.name === 'string') return product.name
    if (typeof item.name === 'string') return item.name
    return 'Sin nombre'
}

export const normalizeCurrentStock = (data: unknown): CurrentStockItem[] =>
    normalizeList<Record<string, unknown>>(data).map(item => ({
        product_id: resolveProductId(item),
        product_name: resolveProductName(item),
        quantity: Number(item.quantity ?? item.current_quantity ?? item.balance ?? 0),
    }))

export const normalizeMovements = (data: unknown): InventoryMovement[] =>
    normalizeList<Record<string, unknown>>(data).map(item => {
        const productId = resolveProductId(item)
        return {
            id: Number(item.id ?? 0),
            product: productId,
            product_name: resolveProductName(item),
            movement_type: (item.movement_type as MovementType) ?? 'OUT',
            quantity: Number(item.quantity ?? 0),
            source: (item.source as MovementSource) ?? 'USAGE',
            purchase: item.purchase != null ? Number(item.purchase) : null,
            movement_date: String(item.movement_date ?? ''),
            notes: String(item.notes ?? ''),
            created_by: item.created_by != null ? Number(item.created_by) : null,
            created_at: String(item.created_at ?? ''),
            updated_at: String(item.updated_at ?? ''),
        }
    })

export const normalizeReport = (data: unknown): InventoryReportItem[] =>
    normalizeList<Record<string, unknown>>(data).map(item => ({
        product_id: resolveProductId(item),
        product_name: resolveProductName(item),
        date: String(item.date ?? item.movement_date ?? ''),
        in: Number(item.in ?? item.total_in ?? item.entrada ?? 0),
        out: Number(item.out ?? item.total_out ?? item.salida ?? 0),
        balance: Number(item.balance ?? item.saldo ?? 0),
    }))
