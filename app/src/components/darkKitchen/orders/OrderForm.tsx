import { motion } from 'framer-motion'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import type { KitchenAccount } from '../../../services/kitchen/accountService'
import type { KitchenDish } from '../../../services/kitchen/dishService'
import type { KitchenTopping } from '../../../services/kitchen/toppingService'
import {
    calculateOrderTotal,
    emptyOrderItem,
    type OrderFormState,
} from '../../../utils/orderHelpers'
import { formatDecimal } from '../../../utils/inventoryHelpers'

interface Props {
    value: OrderFormState
    dishes: KitchenDish[]
    accounts: KitchenAccount[]
    toppings: KitchenTopping[]
    isSubmitting: boolean
    submitLabel: string
    error?: string
    onChange: (value: OrderFormState) => void
    onSubmit: () => void
    onCancel?: () => void
}

const OrderForm = ({
    value,
    dishes,
    accounts,
    toppings,
    isSubmitting,
    submitLabel,
    error,
    onChange,
    onSubmit,
    onCancel,
}: Props) => {
    const updateItem = (index: number, patch: Partial<OrderFormState['order_items'][number]>) => {
        const orderItems = value.order_items.map((item, itemIndex) =>
            itemIndex === index ? { ...item, ...patch } : item,
        )
        onChange({ ...value, order_items: orderItems })
    }

    const removeItem = (index: number) => {
        onChange({
            ...value,
            order_items: value.order_items.filter((_, itemIndex) => itemIndex !== index),
        })
    }

    const addTopping = (itemIndex: number) => {
        const item = value.order_items[itemIndex]
        updateItem(itemIndex, {
            toppings: [...item.toppings, { topping: 0, quantity: 1 }],
        })
    }

    const updateTopping = (
        itemIndex: number,
        toppingIndex: number,
        patch: Partial<OrderFormState['order_items'][number]['toppings'][number]>,
    ) => {
        const item = value.order_items[itemIndex]
        updateItem(itemIndex, {
            toppings: item.toppings.map((line, lineIndex) =>
                lineIndex === toppingIndex ? { ...line, ...patch } : line,
            ),
        })
    }

    const removeTopping = (itemIndex: number, toppingIndex: number) => {
        const item = value.order_items[itemIndex]
        updateItem(itemIndex, {
            toppings: item.toppings.filter((_, lineIndex) => lineIndex !== toppingIndex),
        })
    }

    const total = calculateOrderTotal(value, dishes, toppings)

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {accounts.length > 1 && (
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Cuenta <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={value.account || ''}
                            onChange={(event) => onChange({ ...value, account: Number(event.target.value) })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            disabled={isSubmitting}
                        >
                            <option value="">Seleccionar cuenta</option>
                            {accounts.map(account => (
                                <option key={account.id} value={account.id}>
                                    {account.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Fecha</label>
                    <input
                        type="date"
                        value={value.order_date}
                        onChange={(event) => onChange({ ...value, order_date: event.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        disabled={isSubmitting}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Notas de la orden</label>
                    <input
                        value={value.notes}
                        onChange={(event) => onChange({ ...value, notes: event.target.value })}
                        placeholder="Ej. Mesa 4, para llevar"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">Cliente</h3>
                        <p className="text-xs text-gray-500">El cliente es opcional</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => onChange({
                                ...value,
                                customer_mode: 'anonymous',
                                customer: null,
                            })}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                                value.customer_mode === 'anonymous'
                                    ? 'bg-gray-700 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300'
                            }`}
                            disabled={isSubmitting}
                        >
                            Sin cliente
                        </button>
                        {value.customer && (
                            <button
                                type="button"
                                onClick={() => onChange({ ...value, customer_mode: 'existing' })}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                                    value.customer_mode === 'existing'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-indigo-700 border border-indigo-200'
                                }`}
                                disabled={isSubmitting}
                            >
                                Cliente actual
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => onChange({
                                ...value,
                                customer_mode: 'new',
                                customer: null,
                                customer_names: value.customer_mode === 'existing' ? '' : value.customer_names,
                                customer_address: value.customer_mode === 'existing' ? '' : value.customer_address,
                                customer_extra_info: value.customer_mode === 'existing' ? '' : value.customer_extra_info,
                            })}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                                value.customer_mode === 'new'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-indigo-700 border border-indigo-200'
                            }`}
                            disabled={isSubmitting}
                        >
                            Crear cliente
                        </button>
                    </div>
                </div>

                {value.customer_mode === 'existing' && (
                    <div className="grid grid-cols-1 gap-2 mt-4 text-sm md:grid-cols-3">
                        <p><span className="font-medium text-gray-700">Nombre:</span> {value.customer_names || '—'}</p>
                        <p><span className="font-medium text-gray-700">Dirección:</span> {value.customer_address || '—'}</p>
                        <p><span className="font-medium text-gray-700">Info:</span> {value.customer_extra_info || '—'}</p>
                    </div>
                )}

                {value.customer_mode === 'new' && (
                    <div className="grid grid-cols-1 gap-3 mt-4 md:grid-cols-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Nombres <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={value.customer_names}
                                onChange={(event) => onChange({ ...value, customer_names: event.target.value })}
                                placeholder="John Doe"
                                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Dirección</label>
                            <input
                                value={value.customer_address}
                                onChange={(event) => onChange({ ...value, customer_address: event.target.value })}
                                placeholder="123 Main Street"
                                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Información adicional</label>
                            <input
                                value={value.customer_extra_info}
                                onChange={(event) => onChange({ ...value, customer_extra_info: event.target.value })}
                                placeholder="Llamar al llegar"
                                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Platos</h3>
                    <motion.button
                        type="button"
                        onClick={() => onChange({
                            ...value,
                            order_items: [...value.order_items, emptyOrderItem()],
                        })}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                        disabled={isSubmitting}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Plus className="w-4 h-4" />
                        Agregar plato
                    </motion.button>
                </div>

                {value.order_items.map((item, itemIndex) => {
                    const selectedDish = dishes.find(dish => dish.id === item.dish)
                    return (
                        <div key={itemIndex} className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                                <div className="md:col-span-5">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Plato</label>
                                    <select
                                        value={item.dish || ''}
                                        onChange={(event) => updateItem(itemIndex, {
                                            dish: Number(event.target.value),
                                            unit_price: null,
                                        })}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        disabled={isSubmitting}
                                    >
                                        <option value="">Seleccionar plato</option>
                                        {dishes.map(dish => (
                                            <option key={dish.id} value={dish.id}>
                                                {dish.name} — S/ {formatDecimal(dish.price)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Cantidad</label>
                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={item.quantity || ''}
                                        onChange={(event) => updateItem(itemIndex, {
                                            quantity: Number(event.target.value),
                                        })}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Precio override
                                    </label>
                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={item.unit_price ?? ''}
                                        onChange={(event) => updateItem(itemIndex, {
                                            unit_price: event.target.value === '' ? null : Number(event.target.value),
                                        })}
                                        placeholder={selectedDish ? formatDecimal(selectedDish.price) : 'Opcional'}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Notas</label>
                                    <input
                                        value={item.notes}
                                        onChange={(event) => updateItem(itemIndex, { notes: event.target.value })}
                                        placeholder="Sin cebolla"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="md:col-span-1 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => removeItem(itemIndex)}
                                        disabled={isSubmitting || value.order_items.length === 1}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30"
                                        title="Eliminar plato"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="pl-0 md:pl-4 border-l-0 md:border-l-2 border-orange-200 space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold text-gray-700">Toppings</p>
                                    <button
                                        type="button"
                                        onClick={() => addTopping(itemIndex)}
                                        className="inline-flex items-center gap-1 text-xs text-orange-700 hover:text-orange-800"
                                        disabled={isSubmitting || toppings.length === 0}
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Agregar topping
                                    </button>
                                </div>
                                {item.toppings.map((line, toppingIndex) => (
                                    <div key={toppingIndex} className="grid grid-cols-12 gap-2 items-end">
                                        <select
                                            value={line.topping || ''}
                                            onChange={(event) => updateTopping(itemIndex, toppingIndex, {
                                                topping: Number(event.target.value),
                                            })}
                                            className="col-span-7 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Seleccionar topping</option>
                                            {toppings.map(topping => (
                                                <option key={topping.id} value={topping.id}>
                                                    {topping.name} — S/ {formatDecimal(topping.price)}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            value={line.quantity || ''}
                                            onChange={(event) => updateTopping(itemIndex, toppingIndex, {
                                                quantity: Number(event.target.value),
                                            })}
                                            className="col-span-4 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                            disabled={isSubmitting}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeTopping(itemIndex, toppingIndex)}
                                            className="col-span-1 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            disabled={isSubmitting}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {item.toppings.length === 0 && (
                                    <p className="text-xs text-gray-400">Sin toppings</p>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                <div className="rounded-lg bg-indigo-50 px-4 py-2">
                    <p className="text-xs font-medium text-indigo-600">Total estimado</p>
                    <p className="text-xl font-bold text-indigo-700">S/ {formatDecimal(total)}</p>
                </div>
                <div className="flex justify-end gap-2">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Cancelar
                        </button>
                    )}
                    <motion.button
                        type="button"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        whileTap={{ scale: 0.98 }}
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {submitLabel}
                    </motion.button>
                </div>
            </div>
        </div>
    )
}

export default OrderForm
