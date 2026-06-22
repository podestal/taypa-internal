import KitchenClient from "./kitchenClient"

export type MovementType = 'IN' | 'OUT'
export type MovementSource = 'PURCHASE' | 'USAGE' | 'WASTE' | 'ADJUSTMENT'

export interface InventoryMovement {
    id: number
    product: number
    product_name?: string
    movement_type: MovementType
    quantity: number
    source: MovementSource
    purchase: number | null
    movement_date: string
    notes: string
    created_by: number | null
    created_at: string
    updated_at: string
}

export type CreateInventoryMovement = Pick<
    InventoryMovement,
    'product' | 'movement_type' | 'quantity' | 'source' | 'movement_date' | 'notes'
>

export interface CurrentStockItem {
    product_id: number
    product_name: string
    quantity: number
}

export interface InventoryReportItem {
    product_id: number
    product_name: string
    date: string
    in: number
    out: number
    balance: number
}

export interface InventoryReportParams {
    start_date?: string
    end_date?: string
    product_id?: string
}

interface MovementProps {
    movementId?: number
}

const getCurrentStockService = () =>
    new KitchenClient<CurrentStockItem[]>('inventory/current/')

const getInventoryReportService = () =>
    new KitchenClient<InventoryReportItem[]>('inventory/report/')

const getInventoryMovementService = ({ movementId }: MovementProps = {}) => {
    let url = 'inventory-movements/'
    if (movementId) {
        url += `${movementId}/`
    }
    return new KitchenClient<InventoryMovement[], CreateInventoryMovement>(url)
}

export {
    getCurrentStockService,
    getInventoryReportService,
    getInventoryMovementService,
}
