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

interface Props {
    byClient?: boolean
    inKitchen?: boolean
    orderId?: number
}

const getOrderService = ({ byClient, orderId, inKitchen }: Props) => {
    let url = '/orders/'
    if (byClient) url += 'by_client/'
    if (inKitchen) url += 'in_kitchen/'
    if (orderId) url += `${orderId}/`
    return new APIClient<Order[], CreateUpdateOrder>(url)
}

export default getOrderService