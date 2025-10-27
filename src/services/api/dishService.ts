import APIClient from "./apiClient"

export interface Dish {
    id: number
    name: string
    description: string
    price: number
    category: number
    created_at: string
    updated_at: string
}

export type CreateUpdateDish = Omit<Dish, 'id' | 'created_at' | 'updated_at'>

interface Props {
    byCategory?: boolean
    dishId?: number
}

const getDishService = ({ byCategory, dishId }: Props) => {
    let url = '/dishes'
    if (byCategory) {
        url += `?category=${dishId}`
    } else if (dishId) {
        url += `/${dishId}`
    }
    return new APIClient<Dish[], CreateUpdateDish>(url)
}

export default getDishService