import KitchenClient from "./kitchenClient"

export interface KitchenCategory {
    id: number
    name: string
    description: string
    menu_item: boolean
    is_active: boolean
    created_at: string
    updated_at: string
}

export type CreateKitchenCategory = {
    name: string
    menu_item: boolean
    description?: string
}

export type UpdateKitchenCategory = {
    name: string
    menu_item: boolean
    description?: string
    is_active: boolean
}

export interface KitchenCategoryListParams {
    menu_item?: string
}

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
