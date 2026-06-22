import KitchenClient from "./kitchenClient"

export interface Product {
    id: number
    name: string
    description: string
    quantity: number
    weight: number | null
    volume: number | null
    created_at: string
    updated_at: string
}

export type CreateUpdateProduct = Omit<Product, 'id' | 'created_at' | 'updated_at'>

interface Props {
    productId?: number
}

const getProductService = ({ productId }: Props) => {
    let url = 'products/'
    if (productId) {
        url += `${productId}/`
    }
    return new KitchenClient<Product[], CreateUpdateProduct>(url)
}

export default getProductService
