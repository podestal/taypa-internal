import type {
    CurrentStockItem,
    InventoryMovement,
    InventoryMovementListParams,
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

export const MOVEMENT_SOURCE_OPTIONS: { value: MovementSource; label: string }[] = (
    Object.entries(MOVEMENT_SOURCE_LABELS) as [MovementSource, string][]
).map(([value, label]) => ({ value, label }))

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

export const yesterdayISO = () => daysAgoISO(1)

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
    const fromId = toId(item.id)
    if (fromId != null) return fromId
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

export type MovementHistoryDatePreset = 'today' | 'yesterday' | 'last7days' | 'thisMonth' | 'custom'

export const MOVEMENT_HISTORY_DATE_PRESETS: { id: MovementHistoryDatePreset; label: string }[] = [
    { id: 'yesterday', label: 'Ayer' },
    { id: 'today', label: 'Hoy' },
    { id: 'last7days', label: 'Últimos 7 días' },
    { id: 'thisMonth', label: 'Este mes' },
]

export interface MovementHistoryFilters {
    datePreset: MovementHistoryDatePreset
    start_date: string
    end_date: string
    product_id: string
    source: MovementSource | ''
}

export const getDefaultMovementHistoryFilters = (): MovementHistoryFilters => ({
    datePreset: 'yesterday',
    start_date: '',
    end_date: '',
    product_id: '',
    source: '',
})

const movementDateRangeForPreset = (preset: MovementHistoryDatePreset) => {
    const today = todayISO()
    switch (preset) {
        case 'today':
            return { start_date: today, end_date: today }
        case 'yesterday': {
            const yesterday = yesterdayISO()
            return { start_date: yesterday, end_date: yesterday }
        }
        case 'last7days': {
            const end = new Date()
            const start = new Date()
            start.setDate(start.getDate() - 6)
            return {
                start_date: start.toISOString().split('T')[0],
                end_date: end.toISOString().split('T')[0],
            }
        }
        case 'thisMonth': {
            const now = new Date()
            const start = new Date(now.getFullYear(), now.getMonth(), 1)
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            return {
                start_date: start.toISOString().split('T')[0],
                end_date: end.toISOString().split('T')[0],
            }
        }
        default:
            return null
    }
}

export const buildMovementListParams = (
    filters: MovementHistoryFilters,
): InventoryMovementListParams => {
    const params: InventoryMovementListParams = {}

    if (filters.product_id) {
        params.product_id = filters.product_id
    }
    if (filters.source) {
        params.source = filters.source
    }

    if (filters.datePreset === 'custom') {
        if (filters.start_date) params.start_date = filters.start_date
        if (filters.end_date) params.end_date = filters.end_date
    } else {
        const range = movementDateRangeForPreset(filters.datePreset)
        if (range) {
            params.start_date = range.start_date
            params.end_date = range.end_date
        }
    }

    return params
}

export const sortMovementsDesc = (movements: InventoryMovement[]) =>
    [...movements].sort((a, b) => {
        const dateCmp = b.movement_date.localeCompare(a.movement_date)
        if (dateCmp !== 0) return dateCmp
        return b.id - a.id
    })
