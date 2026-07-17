import KitchenClient from "./kitchenClient"
import type { KitchenCustomer } from "./customerService"

export interface KitchenOrderTransaction {
    id: number
    transaction_type: string
    amount: number
    transaction_date: string
}

export interface KitchenOrderTopping {
    id?: number
    topping: number
    topping_name?: string
    quantity: number
    unit_price: number
    subtotal: number
}

export interface KitchenOrderItem {
    id?: number
    dish: number
    dish_name?: string
    quantity: number
    unit_price: number
    notes?: string
    dish_subtotal: number
    toppings_subtotal: number
    subtotal: number
    toppings: KitchenOrderTopping[]
}

export interface KitchenOrder {
    id: number
    customer: string | null
    customer_details: KitchenCustomer | null
    account: number
    account_name?: string
    subtotal: number
    notes: string
    order_date: string
    transaction: KitchenOrderTransaction | null
    items: KitchenOrderItem[]
    created_at: string
    updated_at: string
}

export interface KitchenOrderToppingPayload {
    topping: number
    quantity: string | number
}

export interface KitchenOrderItemPayload {
    dish: number
    quantity: string | number
    unit_price?: string | number
    notes?: string
    toppings: KitchenOrderToppingPayload[]
}

export interface CreateKitchenOrder {
    customer?: string | null
    account: number
    notes?: string
    order_date?: string
    order_items: KitchenOrderItemPayload[]
}

export type UpdateKitchenOrder = Partial<CreateKitchenOrder>

interface Props {
    orderId?: number
}

const getKitchenOrderService = ({ orderId }: Props = {}) => {
    let url = 'orders/'
    if (orderId) {
        url += `${orderId}/`
    }
    return new KitchenClient<KitchenOrder[], CreateKitchenOrder, UpdateKitchenOrder>(url)
}

export default getKitchenOrderService
