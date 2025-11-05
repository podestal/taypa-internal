import APIClie from "./apiClient"

export interface Category {
    id: number
    name: string
    description: string
    is_active: boolean
    created_at: Date
    updated_at: Date
    is_menu_category: boolean
}

export type CreateUpdateCategory = Omit<Category, 'id' | 'created_at' | 'updated_at'>

interface Props {
    categoryId?: number
}

const getCategoryService = ({ categoryId }: Props) => {
    let url = '/categories/'
    if (categoryId) {
        url += `${categoryId}/`
    }
    return new APIClie<Category[], CreateUpdateCategory>(url)
}

export default getCategoryService