import type { DishIngredient, KitchenDish, CreateKitchenDish } from '../services/kitchen/dishService'
import { normalizeList } from './inventoryHelpers'

const asRecord = (value: unknown): Record<string, unknown> | null =>
    value && typeof value === 'object' ? (value as Record<string, unknown>) : null

const resolveProductId = (item: Record<string, unknown>) => {
    if (typeof item.product === 'number') return item.product
    const product = asRecord(item.product)
    if (product && typeof product.id === 'number') return product.id
    if (typeof item.product_id === 'number') return item.product_id
    return 0
}

const resolveProductName = (item: Record<string, unknown>) => {
    if (typeof item.product_name === 'string') return item.product_name
    const product = asRecord(item.product)
    if (product && typeof product.name === 'string') return product.name
    return undefined
}

const resolveCategoryId = (item: Record<string, unknown>) => {
    if (typeof item.category === 'number') return item.category
    const category = asRecord(item.category)
    if (category && typeof category.id === 'number') return category.id
    if (typeof item.category_id === 'number') return item.category_id
    return 0
}

const resolveCategoryName = (item: Record<string, unknown>) => {
    if (typeof item.category_name === 'string') return item.category_name
    const category = asRecord(item.category)
    if (category && typeof category.name === 'string') return category.name
    return undefined
}

export const normalizeIngredients = (data: unknown): DishIngredient[] => {
    const list = normalizeList<Record<string, unknown>>(data)
    return list.map(item => ({
        id: item.id != null ? Number(item.id) : undefined,
        product: resolveProductId(item),
        product_name: resolveProductName(item),
        quantity: Number(item.quantity ?? 0),
    }))
}

export const normalizeKitchenDishes = (data: unknown): KitchenDish[] =>
    normalizeList<Record<string, unknown>>(data).map(item => ({
        id: Number(item.id ?? 0),
        name: String(item.name ?? ''),
        description: String(item.description ?? ''),
        price: Number(item.price ?? 0),
        points: item.points != null ? Number(item.points) : null,
        category: resolveCategoryId(item),
        category_name: resolveCategoryName(item),
        is_active: Boolean(item.is_active ?? true),
        ingredients: normalizeIngredients(item.ingredients ?? item.dish_ingredients ?? []),
        created_at: String(item.created_at ?? ''),
        updated_at: String(item.updated_at ?? ''),
    }))

export interface DishFormIngredient {
    product: number
    quantity: number
}

export interface DishFormState {
    name: string
    description: string
    price: number
    points: number | null
    category: number
    is_active: boolean
    ingredients: DishFormIngredient[]
}

export const emptyIngredient = (): DishFormIngredient => ({ product: 0, quantity: 0 })

export const initialDishFormData: DishFormState = {
    name: '',
    description: '',
    price: 0,
    points: null,
    category: 0,
    is_active: true,
    ingredients: [emptyIngredient()],
}

export const dishToFormState = (dish: KitchenDish): DishFormState => ({
    name: dish.name,
    description: dish.description,
    price: dish.price,
    points: dish.points ?? null,
    category: dish.category,
    is_active: dish.is_active,
    ingredients: dish.ingredients.length > 0
        ? dish.ingredients.map(i => ({ product: i.product, quantity: i.quantity }))
        : [emptyIngredient()],
})

export const buildDishPayload = (formData: DishFormState): CreateKitchenDish => {
    const validIngredients = formData.ingredients.filter(
        ing => ing.product > 0 && ing.quantity > 0
    )
    return {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        ...(formData.points != null ? { points: formData.points } : {}),
        category: formData.category,
        is_active: formData.is_active,
        ingredients: validIngredients.map(ing => ({
            product: ing.product,
            quantity: ing.quantity,
        })),
    }
}
