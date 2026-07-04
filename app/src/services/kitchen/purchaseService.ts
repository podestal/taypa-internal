import KitchenClient from "./kitchenClient"

export interface PurchaseTransaction {
    id: number
    transaction_type: string
    amount: string
    account: number
    account_name?: string
    description: string
}

export interface Purchase {
    id: number
    product: number
    product_name?: string
    account: number
    account_name?: string
    quantity_bought: number
    unit_price: number
    total: number
    transaction: PurchaseTransaction | null
    notes: string
    purchase_date?: string
    created_at: string
    updated_at: string
}

export type CreatePurchase = {
    product: number
    account: number
    quantity_bought: string | number
    total: string | number
    purchase_date?: string
    notes?: string
}

export type UpdatePurchase = CreatePurchase

export interface PurchaseListParams {
    date?: string
    start_date?: string
    end_date?: string
    product_id?: string
    account_id?: string
}

interface Props {
    purchaseId?: number
}

const getPurchaseService = ({ purchaseId }: Props = {}) => {
    let url = 'purchases/'
    if (purchaseId) {
        url += `${purchaseId}/`
    }
    return new KitchenClient<Purchase[], CreatePurchase, UpdatePurchase>(url)
}

export default getPurchaseService
