import KitchenClient from "./kitchenClient"

export interface DishIngredient {
    id?: number
    product: number
    product_name?: string
    quantity: number
}

export interface KitchenDish {
    id: number
    name: string
    description: string
    price: number
    points?: number | null
    category: number
    category_name?: string
    is_active: boolean
    ingredients: DishIngredient[]
    created_at: string
    updated_at: string
}

export type CreateKitchenDish = Pick<KitchenDish, 'name' | 'description' | 'price' | 'points' | 'category' | 'is_active'> & {
    ingredients: Pick<DishIngredient, 'product' | 'quantity'>[]
}

export type UpdateKitchenDish = CreateKitchenDish

interface Props {
    dishId?: number
}

const getKitchenDishService = ({ dishId }: Props = {}) => {
    let url = 'dishes/'
    if (dishId) {
        url += `${dishId}/`
    }
    return new KitchenClient<KitchenDish[], CreateKitchenDish, UpdateKitchenDish>(url)
}

export default getKitchenDishService
