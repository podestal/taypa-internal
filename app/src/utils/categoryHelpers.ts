import type {
    CreateKitchenCategory,
    KitchenCategory,
    UpdateKitchenCategory,
} from '../services/kitchen/categoryService'
import { normalizeList } from './inventoryHelpers'

export const MENU_ITEM_LABELS = {
    menu: 'Menú',
    finance: 'Finanzas',
} as const

export type CategoryMenuItemFilter = 'all' | 'menu' | 'finance'

export const CATEGORY_MENU_ITEM_FILTERS: { id: CategoryMenuItemFilter; label: string }[] = [
    { id: 'all', label: 'Todas' },
    { id: 'menu', label: MENU_ITEM_LABELS.menu },
    { id: 'finance', label: MENU_ITEM_LABELS.finance },
]

export const normalizeKitchenCategories = (data: unknown): KitchenCategory[] =>
    normalizeList<Record<string, unknown>>(data).map(item => ({
        id: Number(item.id ?? 0),
        name: String(item.name ?? ''),
        description: String(item.description ?? ''),
        menu_item: item.menu_item === false || item.menu_item === 'false' ? false : true,
        is_active: Boolean(item.is_active ?? true),
        created_at: String(item.created_at ?? ''),
        updated_at: String(item.updated_at ?? ''),
    }))

export const isMenuCategory = (category: Pick<KitchenCategory, 'menu_item'>) => category.menu_item

export const isFinanceCategory = (category: Pick<KitchenCategory, 'menu_item'>) => !category.menu_item

export const filterMenuCategories = (categories: KitchenCategory[]) =>
    categories.filter(isMenuCategory)

export const filterFinanceCategories = (categories: KitchenCategory[]) =>
    categories.filter(isFinanceCategory)

export const buildCategoryListParams = (filter: CategoryMenuItemFilter) => {
    if (filter === 'menu') return { menu_item: 'true' }
    if (filter === 'finance') return { menu_item: 'false' }
    return {}
}

export interface CategoryFormState {
    name: string
    description: string
    menu_item: boolean
    is_active: boolean
}

export const initialCategoryFormData = (): CategoryFormState => ({
    name: '',
    description: '',
    menu_item: true,
    is_active: true,
})

export const categoryToFormState = (category: KitchenCategory): CategoryFormState => ({
    name: category.name,
    description: category.description,
    menu_item: category.menu_item,
    is_active: category.is_active,
})

export const buildCategoryCreatePayload = (form: CategoryFormState): CreateKitchenCategory => {
    const name = form.name.trim()

    if (form.menu_item) {
        return { name }
    }

    return {
        name,
        description: form.description.trim(),
        menu_item: false,
    }
}

export const validateCategoryForm = (data: CategoryFormState) => {
    const errors = { name: '', description: '' }
    let isValid = true

    if (!data.name.trim()) {
        errors.name = 'El nombre es requerido'
        isValid = false
    }
    if (!data.menu_item && !data.description.trim()) {
        errors.description = 'La descripción es requerida para categorías de finanzas'
        isValid = false
    }

    return { errors, isValid }
}

export const buildCategoryUpdatePayload = (form: CategoryFormState): UpdateKitchenCategory => {
    const payload: UpdateKitchenCategory = {
        name: form.name.trim(),
        menu_item: form.menu_item,
        is_active: form.is_active,
    }
    if (form.description.trim()) {
        payload.description = form.description.trim()
    }
    return payload
}
