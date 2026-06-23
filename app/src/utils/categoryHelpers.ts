import type { KitchenCategory } from '../services/kitchen/categoryService'
import { normalizeList } from './inventoryHelpers'

export const normalizeKitchenCategories = (data: unknown): KitchenCategory[] =>
    normalizeList<Record<string, unknown>>(data).map(item => ({
        id: Number(item.id ?? 0),
        name: String(item.name ?? ''),
        description: String(item.description ?? ''),
        is_active: Boolean(item.is_active ?? true),
        created_at: String(item.created_at ?? ''),
        updated_at: String(item.updated_at ?? ''),
    }))
