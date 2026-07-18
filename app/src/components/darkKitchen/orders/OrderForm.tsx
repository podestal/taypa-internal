import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Minus, Pencil, Plus, Trash2 } from 'lucide-react'
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
    showCustomerSection?: boolean
    cancelLabel?: string
    onChange: (value: OrderFormState) => void
    onSubmit: () => void
    onBack?: () => void
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
    showCustomerSection = true,
    cancelLabel = 'Cancelar',
    onChange,
    onSubmit,
    onBack,
    onCancel,
}: Props) => {
    const [draftItem, setDraftItem] = useState(emptyOrderItem)
    const [activeCategory, setActiveCategory] = useState<number | null>(null)
    const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null)
    const [draftError, setDraftError] = useState('')
    const dishCategories = useMemo(
        () => Array.from(
            new Map(dishes.map(dish => [
                dish.category,
                dish.category_name ?? `Categoría #${dish.category}`,
            ])).entries(),
        ).map(([id, name]) => ({ id, name })),
        [dishes],
    )

    const selectedDraftDish = dishes.find(dish => dish.id === draftItem.dish)
    const selectedCategory = activeCategory
        ?? selectedDraftDish?.category
        ?? dishCategories[0]?.id
        ?? 0
    const categoryDishes = dishes.filter(dish => dish.category === selectedCategory)

    const updateDraft = (patch: Partial<OrderFormState['order_items'][number]>) => {
        setDraftItem(current => ({ ...current, ...patch }))
        if (draftError) setDraftError('')
    }

    const removeItem = (index: number) => {
        if (editingItemIndex === index) {
            resetDraft()
        } else if (editingItemIndex != null && editingItemIndex > index) {
            setEditingItemIndex(editingItemIndex - 1)
        }
        onChange({
            ...value,
            order_items: value.order_items.filter((_, itemIndex) => itemIndex !== index),
        })
    }

    const addTopping = () => {
        updateDraft({
            toppings: [...draftItem.toppings, { topping: 0, quantity: 1 }],
        })
    }

    const updateTopping = (
        toppingIndex: number,
        patch: Partial<OrderFormState['order_items'][number]['toppings'][number]>,
    ) => {
        updateDraft({
            toppings: draftItem.toppings.map((line, lineIndex) =>
                lineIndex === toppingIndex ? { ...line, ...patch } : line,
            ),
        })
    }

    const removeTopping = (toppingIndex: number) => {
        updateDraft({
            toppings: draftItem.toppings.filter((_, lineIndex) => lineIndex !== toppingIndex),
        })
    }

    const resetDraft = () => {
        setDraftItem(emptyOrderItem())
        setEditingItemIndex(null)
        setDraftError('')
    }

    const saveDraftItem = () => {
        if (!draftItem.dish) {
            setDraftError('Selecciona un plato')
            return
        }
        if (draftItem.toppings.some(line => !line.topping || line.quantity <= 0)) {
            setDraftError('Completa o elimina los toppings incompletos')
            return
        }

        const normalizedItem = {
            ...draftItem,
            quantity: Math.max(1, Math.floor(draftItem.quantity)),
        }
        const orderItems = editingItemIndex == null
            ? [...value.order_items, normalizedItem]
            : value.order_items.map((item, index) =>
                index === editingItemIndex ? normalizedItem : item,
            )
        onChange({ ...value, order_items: orderItems })
        resetDraft()
    }

    const editItem = (index: number) => {
        const item = value.order_items[index]
        const dish = dishes.find(option => option.id === item.dish)
        setDraftItem({
            ...item,
            toppings: item.toppings.map(line => ({ ...line })),
        })
        setActiveCategory(dish?.category ?? null)
        setEditingItemIndex(index)
        setDraftError('')
    }

    const updateRowQuantity = (index: number, quantity: number) => {
        onChange({
            ...value,
            order_items: value.order_items.map((item, itemIndex) =>
                itemIndex === index ? { ...item, quantity: Math.max(1, quantity) } : item,
            ),
        })
    }

    const getItemTotal = (item: OrderFormState['order_items'][number]) => {
        const dishPrice = item.unit_price ?? dishes.find(dish => dish.id === item.dish)?.price ?? 0
        const toppingsTotal = item.toppings.reduce((sum, line) => {
            const toppingPrice = toppings.find(topping => topping.id === line.topping)?.price ?? 0
            return sum + toppingPrice * line.quantity
        }, 0)
        return dishPrice * item.quantity + toppingsTotal
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

            {showCustomerSection && (
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
            )}

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {editingItemIndex == null ? 'Agregar plato' : 'Editar plato'}
                        </h3>
                        <p className="text-xs text-gray-500">Usa este formulario para agregar productos a la orden</p>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                            <div className="space-y-3">
                                <div>
                                    <p className="mb-2 text-xs font-medium text-gray-700">Categoría</p>
                                    <div className="flex gap-2 pb-1 overflow-x-auto">
                                        {dishCategories.map(category => (
                                            <button
                                                key={category.id}
                                                type="button"
                                                onClick={() => {
                                                    setActiveCategory(category.id)
                                                    if (selectedDraftDish?.category !== category.id) {
                                                        updateDraft({ dish: 0, unit_price: null })
                                                    }
                                                }}
                                                disabled={isSubmitting}
                                                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
                                                    selectedCategory === category.id
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-300'
                                                }`}
                                            >
                                                {category.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-2 text-xs font-medium text-gray-700">Plato</p>
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                                        {categoryDishes.map(dish => (
                                            <button
                                                key={dish.id}
                                                type="button"
                                                onClick={() => updateDraft({
                                                    dish: dish.id,
                                                    unit_price: null,
                                                })}
                                                disabled={isSubmitting}
                                                className={`p-3 text-left border rounded-xl ${
                                                    draftItem.dish === dish.id
                                                        ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                                                        : 'border-gray-200 bg-white hover:border-indigo-300'
                                                }`}
                                            >
                                                <p className="text-sm font-semibold text-gray-900">{dish.name}</p>
                                                <p className="mt-1 text-xs font-medium text-indigo-600">
                                                    S/ {formatDecimal(dish.price)}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Cantidad</label>
                                    <div className="flex items-center overflow-hidden bg-white border border-gray-300 rounded-lg">
                                        <button
                                            type="button"
                                            onClick={() => updateDraft({
                                                quantity: Math.max(1, Math.floor(draftItem.quantity) - 1),
                                            })}
                                            disabled={isSubmitting || draftItem.quantity <= 1}
                                            className="p-2.5 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                                            aria-label="Disminuir cantidad"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            step="1"
                                            value={draftItem.quantity}
                                            onChange={(event) => updateDraft({
                                                quantity: Math.max(1, Math.floor(Number(event.target.value) || 1)),
                                            })}
                                            className="w-full px-2 py-2 text-base font-semibold text-center border-x border-gray-200 appearance-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                                            disabled={isSubmitting}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => updateDraft({
                                                quantity: Math.floor(draftItem.quantity) + 1,
                                            })}
                                            disabled={isSubmitting}
                                            className="p-2.5 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                                            aria-label="Aumentar cantidad"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Precio override
                                    </label>
                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={draftItem.unit_price ?? ''}
                                        onChange={(event) => updateDraft({
                                            unit_price: event.target.value === '' ? null : Number(event.target.value),
                                        })}
                                        placeholder={selectedDraftDish ? formatDecimal(selectedDraftDish.price) : 'Opcional'}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="md:col-span-5">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Notas</label>
                                    <input
                                        value={draftItem.notes}
                                        onChange={(event) => updateDraft({ notes: event.target.value })}
                                        placeholder="Sin cebolla"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="md:col-span-1 flex justify-end">
                                    {editingItemIndex != null && (
                                        <button
                                            type="button"
                                            onClick={resetDraft}
                                            disabled={isSubmitting}
                                            className="px-3 py-2 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="pl-0 md:pl-4 border-l-0 md:border-l-2 border-orange-200 space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold text-gray-700">Toppings</p>
                                    <button
                                        type="button"
                                        onClick={addTopping}
                                        className="inline-flex items-center gap-1 text-xs text-orange-700 hover:text-orange-800"
                                        disabled={isSubmitting || toppings.length === 0}
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Agregar topping
                                    </button>
                                </div>
                                {draftItem.toppings.map((line, toppingIndex) => (
                                    <div key={toppingIndex} className="grid grid-cols-12 gap-2 items-end">
                                        <select
                                            value={line.topping || ''}
                                            onChange={(event) => updateTopping(toppingIndex, {
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
                                            onChange={(event) => updateTopping(toppingIndex, {
                                                quantity: Number(event.target.value),
                                            })}
                                            className="col-span-4 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                            disabled={isSubmitting}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeTopping(toppingIndex)}
                                            className="col-span-1 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            disabled={isSubmitting}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {draftItem.toppings.length === 0 && (
                                    <p className="text-xs text-gray-400">Sin toppings</p>
                                )}
                            </div>

                    {draftError && <p className="text-sm text-red-600">{draftError}</p>}

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={saveDraftItem}
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            <Plus className="w-4 h-4" />
                            {editingItemIndex == null ? 'Agregar a la orden' : 'Guardar cambios'}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Detalle de la orden</h3>
                        <span className="px-2 py-1 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full">
                            {value.order_items.length}
                        </span>
                    </div>
                    {value.order_items.length === 0 ? (
                        <div className="py-8 text-sm text-center text-gray-500 bg-white border border-dashed border-gray-300 rounded-xl">
                            Aún no agregaste platos a la orden
                        </div>
                    ) : (
                        <div className="overflow-hidden bg-white border border-gray-200 rounded-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="text-gray-600 bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-2 font-medium text-left">Plato</th>
                                            <th className="px-3 py-2 font-medium text-center">Cantidad</th>
                                            <th className="px-3 py-2 font-medium text-left">Toppings / notas</th>
                                            <th className="px-3 py-2 font-medium text-right">Total</th>
                                            <th className="px-3 py-2 font-medium text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {value.order_items.map((item, index) => {
                                            const dish = dishes.find(option => option.id === item.dish)
                                            const toppingNames = item.toppings.map(line => {
                                                const topping = toppings.find(option => option.id === line.topping)
                                                return `${formatDecimal(line.quantity)}× ${topping?.name ?? 'Topping'}`
                                            }).join(', ')
                                            return (
                                                <tr key={`${item.dish}-${index}`}>
                                                    <td className="px-3 py-3">
                                                        <p className="font-semibold text-gray-900">
                                                            {dish?.name ?? `Plato #${item.dish}`}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            S/ {formatDecimal(item.unit_price ?? dish?.price ?? 0)} c/u
                                                        </p>
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => updateRowQuantity(index, item.quantity - 1)}
                                                                disabled={isSubmitting || item.quantity <= 1}
                                                                className="p-1.5 text-gray-600 rounded hover:bg-gray-100 disabled:opacity-30"
                                                            >
                                                                <Minus className="w-3.5 h-3.5" />
                                                            </button>
                                                            <span className="w-7 font-semibold text-center">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateRowQuantity(index, item.quantity + 1)}
                                                                disabled={isSubmitting}
                                                                className="p-1.5 text-gray-600 rounded hover:bg-gray-100"
                                                            >
                                                                <Plus className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="max-w-xs px-3 py-3 text-xs text-gray-600">
                                                        <p>{toppingNames || 'Sin toppings'}</p>
                                                        {item.notes && <p className="mt-1 italic">{item.notes}</p>}
                                                    </td>
                                                    <td className="px-3 py-3 font-semibold text-right text-indigo-700 whitespace-nowrap">
                                                        S/ {formatDecimal(getItemTotal(item))}
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <div className="flex justify-end gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => editItem(index)}
                                                                disabled={isSubmitting}
                                                                className="p-2 text-indigo-600 rounded-lg hover:bg-indigo-50"
                                                                title="Editar"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(index)}
                                                                disabled={isSubmitting}
                                                                className="p-2 text-red-600 rounded-lg hover:bg-red-50"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                <div className="rounded-lg bg-indigo-50 px-4 py-2">
                    <p className="text-xs font-medium text-indigo-600">Total estimado</p>
                    <p className="text-xl font-bold text-indigo-700">S/ {formatDecimal(total)}</p>
                </div>
                <div className="flex justify-end gap-2">
                    {onBack && (
                        <button
                            type="button"
                            onClick={onBack}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                        >
                            Atrás
                        </button>
                    )}
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            {cancelLabel}
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
