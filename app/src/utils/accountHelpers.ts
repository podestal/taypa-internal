import type { KitchenAccount } from '../services/kitchen/accountService'
import { normalizeList } from './inventoryHelpers'

export const normalizeKitchenAccounts = (data: unknown): KitchenAccount[] =>
    normalizeList<Record<string, unknown>>(data).map(item => ({
        id: Number(item.id ?? 0),
        name: String(item.name ?? ''),
        balance: Number(item.balance ?? 0),
        is_active: Boolean(item.is_active ?? true),
        created_at: String(item.created_at ?? ''),
        updated_at: String(item.updated_at ?? ''),
    }))
