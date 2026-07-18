import type { KitchenCustomer } from '../services/kitchen/customerService'
import { normalizeList } from './inventoryHelpers'

export const normalizeKitchenCustomers = (data: unknown): KitchenCustomer[] =>
    normalizeList<Record<string, unknown>>(data).map(item => ({
        id: String(item.id ?? item.uuid ?? ''),
        names: String(item.names ?? ''),
        address: String(item.address ?? ''),
        extra_info: String(item.extra_info ?? ''),
    }))
