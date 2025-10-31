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
}

export type CreateUpdateOrder = Omit<Order, 'id' | 'created_at' | 'updated_at' | 'order_number'>

export type OrderByStatus = Omit<Order, 'customer' | 'address'> & {
    customer_name: string
    address_info: string
    categories: CategoryOrderItem[]
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