import KitchenClient from "./kitchenClient"

export interface KitchenTopping {
    id: number
    name: string
    price: number
    product: number
    product_name?: string
    quantity: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export type CreateKitchenTopping = Pick<KitchenTopping, 'name' | 'price' | 'product' | 'quantity' | 'is_active'>

export type CreateKitchenToppingPayload = {
    name: string
    price: string | number
    product: number
    quantity: string | number
    is_active: boolean
}

export type UpdateKitchenTopping = Partial<CreateKitchenToppingPayload>

interface Props {
    toppingId?: number
}

const getToppingService = ({ toppingId }: Props = {}) => {
    let url = 'toppings/'
    if (toppingId) {
        url += `${toppingId}/`
    }
    return new KitchenClient<KitchenTopping[], CreateKitchenToppingPayload, UpdateKitchenTopping>(url)
}

export default getToppingService
