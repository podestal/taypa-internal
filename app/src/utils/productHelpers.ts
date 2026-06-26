import type { Product, ProductType } from '../services/kitchen/productService'
import type { CurrentStockItem } from '../services/kitchen/inventoryService'
import { normalizeList } from './inventoryHelpers'

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
    I: 'Ingrediente',
    O: 'Otro',
}

const normalizeProductType = (value: unknown): ProductType => {
    if (value === 'O' || value === 'OTHER' || value === 'o') return 'O'
    if (value === 'I' || value === 'INGREDIENT' || value === 'i') return 'I'
    return 'I'
}

export const normalizeProducts = (data: unknown): Product[] =>
    normalizeList<Record<string, unknown>>(data).map(item => ({
        id: Number(item.id ?? 0),
        name: String(item.name ?? ''),
        description: String(item.description ?? ''),
        quantity: Number(item.quantity ?? 0),
        weight: item.weight != null ? Number(item.weight) : null,
        volume: item.volume != null ? Number(item.volume) : null,
        product_type: normalizeProductType(item.product_type),
        created_at: String(item.created_at ?? ''),
        updated_at: String(item.updated_at ?? ''),
    }))

export const isIngredientProduct = (product: Pick<Product, 'product_type'>) =>
    product.product_type === 'I'

export const buildIngredientStockItems = (
    products: Product[],
    stockItems: CurrentStockItem[],
): CurrentStockItem[] => {
    const stockByProductId = new Map(stockItems.map(item => [item.product_id, item]))

    return products
        .filter(isIngredientProduct)
        .map(product => {
            const stock = stockByProductId.get(product.id)
            return {
                product_id: product.id,
                product_name: stock?.product_name || product.name,
                quantity: stock?.quantity ?? product.quantity ?? 0,
            }
        })
        .sort((a, b) => a.product_name.localeCompare(b.product_name, 'es'))
}
