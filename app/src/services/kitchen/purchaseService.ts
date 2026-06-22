import KitchenClient from "./kitchenClient"

export interface Purchase {
    id: number
    product: number
    product_name?: string
    account: number
    account_name?: string
    quantity_bought: number
    unit_price: number
    transaction: number | null
    notes: string
    created_at: string
    updated_at: string
}

export type CreatePurchase = Pick<Purchase, 'product' | 'account' | 'quantity_bought' | 'unit_price' | 'notes'>

interface Props {
    purchaseId?: number
}

const getPurchaseService = ({ purchaseId }: Props = {}) => {
    let url = 'purchases/'
    if (purchaseId) {
        url += `${purchaseId}/`
    }
    return new KitchenClient<Purchase[], CreatePurchase>(url)
}

export default getPurchaseService
