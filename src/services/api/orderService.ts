import APIClient from "./apiClient"

export interface Order {
    id: number
    created_by: number
    order_number: string
    customer: number
    address: number
    created_at: string
    updated_at: string
    order_type: string
    status: string
}

export type CreateUpdateOrder = Omit<Order, 'id' | 'created_at' | 'updated_at' | 'order_number'>


export interface CategoryOrderItem {
    id: number
    dish: string
    quantity: number
    observation: string
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