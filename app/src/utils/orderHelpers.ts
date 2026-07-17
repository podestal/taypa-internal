import type {
    CreateKitchenOrder,
    KitchenOrder,
    KitchenOrderItem,
    KitchenOrderTopping,
} from '../services/kitchen/orderService'
import type { KitchenDish } from '../services/kitchen/dishService'
import type { KitchenTopping } from '../services/kitchen/toppingService'
import { normalizeList, todayISO } from './inventoryHelpers'

const asRecord = (value: unknown): Record<string, unknown> | null =>
    value && typeof value === 'object' ? value as Record<string, unknown> : null

const toId = (value: unknown): number => {
    const nested = asRecord(value)
    return Number(nested?.id ?? value ?? 0)
}

const normalizeOrderTopping = (value: unknown): KitchenOrderTopping | null => {
    const item = asRecord(value)
    if (!item) return null
    const quantity = Number(item.quantity ?? 0)
    const unitPrice = Number(item.unit_price ?? item.price ?? 0)
    return {
        id: item.id != null ? Number(item.id) : undefined,
        topping: toId(item.topping ?? item.topping_id),
        topping_name: typeof item.topping_name === 'string'
            ? item.topping_name
            : String(asRecord(item.topping)?.name ?? '') || undefined,
        quantity,
        unit_price: unitPrice,
        subtotal: Number(item.subtotal ?? quantity * unitPrice),
    }
}

const normalizeOrderItem = (value: unknown): KitchenOrderItem | null => {
    const item = asRecord(value)
    if (!item) return null
    const quantity = Number(item.quantity ?? 0)
    const unitPrice = Number(item.unit_price ?? item.price ?? 0)
    const toppings = Array.isArray(item.toppings)
        ? item.toppings.map(normalizeOrderTopping).filter((line): line is KitchenOrderTopping => line != null)
        : []
    const dishSubtotal = Number(item.dish_subtotal ?? quantity * unitPrice)
    const toppingsSubtotal = Number(
        item.toppings_subtotal ?? toppings.reduce((sum, line) => sum + line.subtotal, 0),
    )
    return {
        id: item.id != null ? Number(item.id) : undefined,
        dish: toId(item.dish ?? item.dish_id),
        dish_name: typeof item.dish_name === 'string'
            ? item.dish_name
            : String(asRecord(item.dish)?.name ?? '') || undefined,
        quantity,
        unit_price: unitPrice,
        notes: item.notes != null ? String(item.notes) : undefined,
        dish_subtotal: dishSubtotal,
        toppings_subtotal: toppingsSubtotal,
        subtotal: Number(item.subtotal ?? dishSubtotal + toppingsSubtotal),
        toppings,
    }
}

export const normalizeKitchenOrder = (value: unknown): KitchenOrder => {
    const item = asRecord(value) ?? {}
    const transactionRecord = asRecord(item.transaction)
    const accountRecord = asRecord(item.account)
    const customerRecord = asRecord(item.customer_details)
    const rawItems = Array.isArray(item.items)
        ? item.items
        : Array.isArray(item.order_items)
            ? item.order_items
            : []
    const items = rawItems.map(normalizeOrderItem).filter((line): line is KitchenOrderItem => line != null)

    return {
        id: Number(item.id ?? 0),
        customer: item.customer != null ? String(item.customer) : null,
        customer_details: customerRecord
            ? {
                id: String(customerRecord.id ?? item.customer ?? ''),
                names: String(customerRecord.names ?? ''),
                address: String(customerRecord.address ?? ''),
                extra_info: String(customerRecord.extra_info ?? ''),
            }
            : null,
        account: toId(item.account ?? item.account_id),
        account_name: typeof item.account_name === 'string'
            ? item.account_name
            : String(accountRecord?.name ?? '') || undefined,
        subtotal: Number(
            item.subtotal
            ?? transactionRecord?.amount
            ?? items.reduce((sum, line) => sum + line.subtotal, 0),
        ),
        notes: String(item.notes ?? ''),
        order_date: String(item.order_date ?? transactionRecord?.transaction_date ?? item.created_at ?? ''),
        transaction: transactionRecord
            ? {
                id: Number(transactionRecord.id ?? 0),
                transaction_type: String(transactionRecord.transaction_type ?? 'I'),
                amount: Number(transactionRecord.amount ?? 0),
                transaction_date: String(transactionRecord.transaction_date ?? ''),
            }
            : null,
        items,
        created_at: String(item.created_at ?? ''),
        updated_at: String(item.updated_at ?? ''),
    }
}

export const normalizeKitchenOrders = (data: unknown): KitchenOrder[] =>
    normalizeList<unknown>(data).map(normalizeKitchenOrder)

export interface OrderFormTopping {
    topping: number
    quantity: number
}

export interface OrderFormItem {
    dish: number
    quantity: number
    unit_price: number | null
    notes: string
    toppings: OrderFormTopping[]
}

export interface OrderFormState {
    customer_mode: 'anonymous' | 'existing' | 'new'
    customer: string | null
    customer_names: string
    customer_address: string
    customer_extra_info: string
    account: number
    notes: string
    order_date: string
    order_items: OrderFormItem[]
}

export const emptyOrderItem = (): OrderFormItem => ({
    dish: 0,
    quantity: 1,
    unit_price: null,
    notes: '',
    toppings: [],
})

export const initialOrderForm = (): OrderFormState => ({
    customer_mode: 'anonymous',
    customer: null,
    customer_names: '',
    customer_address: '',
    customer_extra_info: '',
    account: 0,
    notes: '',
    order_date: todayISO(),
    order_items: [emptyOrderItem()],
})

export const orderToFormState = (order: KitchenOrder): OrderFormState => ({
    customer_mode: order.customer ? 'existing' : 'anonymous',
    customer: order.customer,
    customer_names: order.customer_details?.names ?? '',
    customer_address: order.customer_details?.address ?? '',
    customer_extra_info: order.customer_details?.extra_info ?? '',
    account: order.account,
    notes: order.notes,
    order_date: order.order_date.split('T')[0],
    order_items: order.items.map(item => ({
        dish: item.dish,
        quantity: item.quantity,
        unit_price: item.unit_price,
        notes: item.notes ?? '',
        toppings: item.toppings.map(line => ({
            topping: line.topping,
            quantity: line.quantity,
        })),
    })),
})

export const buildOrderPayload = (form: OrderFormState): CreateKitchenOrder => ({
    customer: form.customer_mode === 'existing' ? form.customer : null,
    account: form.account,
    notes: form.notes.trim(),
    order_date: form.order_date,
    order_items: form.order_items.map(item => ({
        dish: item.dish,
        quantity: item.quantity.toFixed(2),
        ...(item.unit_price != null && item.unit_price > 0
            ? { unit_price: item.unit_price.toFixed(2) }
            : {}),
        ...(item.notes.trim() ? { notes: item.notes.trim() } : {}),
        toppings: item.toppings
            .filter(line => line.topping > 0 && line.quantity > 0)
            .map(line => ({
                topping: line.topping,
                quantity: line.quantity.toFixed(2),
            })),
    })),
})

export const calculateOrderTotal = (
    form: OrderFormState,
    dishes: KitchenDish[],
    toppings: KitchenTopping[],
) => form.order_items.reduce((orderSum, item) => {
    const dishPrice = item.unit_price ?? dishes.find(dish => dish.id === item.dish)?.price ?? 0
    const dishTotal = dishPrice * item.quantity
    const toppingTotal = item.toppings.reduce((sum, line) => {
        const price = toppings.find(topping => topping.id === line.topping)?.price ?? 0
        return sum + price * line.quantity
    }, 0)
    return orderSum + dishTotal + toppingTotal
}, 0)
