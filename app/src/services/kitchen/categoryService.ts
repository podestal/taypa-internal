import KitchenClient from "./kitchenClient"

export interface KitchenCategory {
    id: number
    name: string
    description: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export type CreateKitchenCategory = Pick<KitchenCategory, 'name' | 'description' | 'is_active'>

export type UpdateKitchenCategory = CreateKitchenCategory

interface Props {
    categoryId?: number
}

const getKitchenCategoryService = ({ categoryId }: Props = {}) => {
    let url = 'categories/'
    if (categoryId) {
        url += `${categoryId}/`
    }
    return new KitchenClient<KitchenCategory[], CreateKitchenCategory, UpdateKitchenCategory>(url)
}

export default getKitchenCategoryService
