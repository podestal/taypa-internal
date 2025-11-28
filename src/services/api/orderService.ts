import APIClient from "./apiClient"

export interface Order {
    id: number
    created_by: number
    order_number: string
    customer: number
    address: number
    created_at: Date
    updated_at: Date
    order_type: string
    status: string
}

export interface CategoryOrderItem {
    id: number
    dish: string
    quantity: number
    observation: string
    price?: number
}

export type CreateUpdateOrder = Omit<Order, 'id' | 'created_at' | 'updated_at' | 'order_number'>

export type OrderByStatus = Omit<Order, 'customer' | 'address'> & {
    customer_name: string
    address_info: string
    categories: Record<string, CategoryOrderItem[]>
}

export const getOrderByStatusService = () => {
    return new APIClient<OrderByStatus[]>('/orders/by_status/')
}

export interface OrderInKitchen extends Order {
    categories: Record<string, CategoryOrderItem[]>    
}

export const getOrderInKitchenService = () => {
    return new APIClient<OrderInKitchen[]>('/orders/in_kitchen/')
}

export interface OrderItemForBilling {
    id: string
    name: string
    quantity: number
    cost: number
}

export interface OrderForBilling {
    id: number
    order_number: string
    status: string
    created_at: string
    order_type: string
    customer_name: string
    customer_phone: string
    customer_ruc: string
    customer_address: string
    order_items: OrderItemForBilling[]
    total_amount: number
    has_document: boolean
    document: any | null
}

export interface OrdersForBillingPage {
    count: number
    next: string | null
    previous: string | null
    results: OrderForBilling[]
}

export const getOrderForBillingService = () => {
    return new APIClient<OrdersForBillingPage>('/orders/for-billing/')
}

interface Props {
    byClient?: boolean
    inKitchen?: boolean
    orderId?: number
}

const getOrderService = ({ byClient, orderId }: Props) => {
    let url = '/orders/'
    if (byClient) url += 'by_client/'
    if (orderId) url += `${orderId}/`
    return new APIClient<Order[], CreateUpdateOrder>(url)
}

export default getOrderService