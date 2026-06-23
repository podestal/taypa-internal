import KitchenClient from "./kitchenClient"

export interface SaleTransaction {
    id: number
    transaction_type: string
    amount: string
    account: number
    description: string
}

export interface SaleToppingLine {
    id?: number
    topping: number
    topping_name?: string
    quantity: number
    unit_price?: number
    subtotal?: number
}

export interface Sale {
    id: number
    dish: number
    dish_name?: string
    quantity_sold: number
    unit_price: number
    subtotal: number
    notes: string
    toppings: SaleToppingLine[]
    transaction: SaleTransaction | null
    created_at: string
    updated_at: string
}

export type CreateSaleTopping = {
    topping: number
    quantity: string | number
}

export type CreateSale = {
    dish: number
    account: number
    quantity_sold: string | number
    unit_price?: string | number
    notes?: string
    toppings?: CreateSaleTopping[]
}

interface Props {
    saleId?: number
}

const getSaleService = ({ saleId }: Props = {}) => {
    let url = 'sales/'
    if (saleId) {
        url += `${saleId}/`
    }
    return new KitchenClient<Sale[], CreateSale>(url)
}

export default getSaleService
