import APIClient from "./apiClient"

export interface OrderItem {
    id: number
    order: number
    dish: number
    price: number
    quantity: number
    observation: string
    category: number
    created_at: string
    updated_at: string
}

export type CreateUpdateOrderItem = Omit<OrderItem, 'id' | 'created_at' | 'updated_at'>

interface Props {
    orderItemId?: number
    byOrder?: boolean
}

const getOrderItemService = ({ orderItemId, byOrder }: Props) => {
    let url = '/order-items/'
    if (orderItemId) {
        url += `${orderItemId}/`
    }
    if (byOrder) {
        url += `by_order/`
    }
    return new APIClient<OrderItem[], CreateUpdateOrderItem>(url)
}

export default getOrderItemService