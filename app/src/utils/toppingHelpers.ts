import type { CreateKitchenTopping, CreateKitchenToppingPayload, KitchenTopping } from '../services/kitchen/toppingService'
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

const toTopping = (item: Record<string, unknown>): KitchenTopping => ({
    id: Number(item.id ?? 0),
    name: String(item.name ?? ''),
    price: Number(item.price ?? 0),
    product: resolveProductId(item),
    product_name: resolveProductName(item),
    quantity: Number(item.quantity ?? 0),
    is_active: item.is_active !== false,
    created_at: String(item.created_at ?? ''),
    updated_at: String(item.updated_at ?? ''),
})

export const normalizeToppings = (data: unknown): KitchenTopping[] =>
    normalizeList<Record<string, unknown>>(data).map(toTopping)

export const toppingToFormState = (topping: KitchenTopping): CreateKitchenTopping => ({
    name: topping.name,
    price: topping.price,
    product: topping.product,
    quantity: topping.quantity,
    is_active: topping.is_active,
})

export const buildToppingPayload = (form: CreateKitchenTopping): CreateKitchenToppingPayload => ({
    name: form.name.trim(),
    price: form.price.toFixed(2),
    product: form.product,
    quantity: form.quantity.toFixed(2),
    is_active: form.is_active,
})
