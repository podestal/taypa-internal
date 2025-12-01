import APIClient from "./apiClient"

export interface Dish {
    id: number
    name: string
    description: string
    price: number
    category: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export type CreateUpdateDish = Omit<Dish, 'id' | 'created_at' | 'updated_at'>

interface Props {
    byCategory?: boolean
    dishId?: number
}

const getDishService = ({ byCategory, dishId }: Props) => {
    let url = '/dishes/'
    if (byCategory) {
        url += `by_category/`
    } else if (dishId) {
        url += `${dishId}/`
    }
    return new APIClient<Dish[] | Dish, CreateUpdateDish>(url)
}

export default getDishService