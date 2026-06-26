import { motion } from 'framer-motion'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import type { KitchenDish } from '../../../services/kitchen/dishService'
import type { KitchenAccount } from '../../../services/kitchen/accountService'
import type { KitchenTopping } from '../../../services/kitchen/toppingService'
import { formatDecimal, todayISO, yesterdayISO } from '../../../utils/inventoryHelpers'
import type { SaleFormState, SaleFormTopping, SaleDatePreset } from '../../../utils/saleHelpers'
import { saleSubtotal, saleTotal } from '../../../utils/saleHelpers'

interface FormErrors {
    dish: string
    account: string
    quantity_sold: string
    sale_date: string
}

interface Props {
    formData: SaleFormState
    errors: FormErrors
    dishes: KitchenDish[]
    accounts: KitchenAccount[]
    toppings: KitchenTopping[]
    saleDatePreset: SaleDatePreset
    isSubmitting: boolean
    onInputChange: (field: keyof Omit<SaleFormState, 'toppings'>, value: string | number) => void
    onSaleDatePresetChange: (preset: SaleDatePreset) => void
    onToppingChange: (index: number, field: keyof SaleFormTopping, value: number) => void
    onAddTopping: () => void
    onRemoveTopping: (index: number) => void
    onSubmit: () => void
}

const SaleForm = ({
    formData,
    errors,
    dishes,
    accounts,
    toppings,
    saleDatePreset,
    isSubmitting,
    onInputChange,
    onSaleDatePresetChange,
    onToppingChange,
    onAddTopping,
    onRemoveTopping,
    onSubmit,
}: Props) => {
    const selectedDish = dishes.find(d => d.id === formData.dish)
    const selectedAccount = accounts.find(a => a.id === formData.account)
    const dishSubtotal = saleSubtotal(formData.quantity_sold, formData.unit_price)
    const total = saleTotal(formData, toppings)
    const toppingsExtra = total - dishSubtotal

    const handleSaleDatePreset = (preset: 'today' | 'yesterday') => {
        onSaleDatePresetChange(preset)
        onInputChange('sale_date', preset === 'today' ? todayISO() : yesterdayISO())
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-5 border border-gray-200"
        >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Nueva venta</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Plato <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.dish || ''}
                        onChange={(e) => {
                            const dishId = parseInt(e.target.value, 10)
                            onInputChange('dish', dishId)
                            const dish = dishes.find(d => d.id === dishId)
                            if (dish) {
                                onInputChange('unit_price', dish.price)
                            }
                        }}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.dish ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                    >
                        <option value="">Seleccionar plato</option>
                        {dishes.map(dish => (
                            <option key={dish.id} value={dish.id}>
                                {dish.name} — S/ {formatDecimal(dish.price)}
                            </option>
                        ))}
                    </select>
                    {errors.dish && <p className="text-red-500 text-xs mt-1">{errors.dish}</p>}
                    {selectedDish && selectedDish.ingredients.length === 0 && (
                        <p className="text-amber-600 text-xs mt-1">
                            Este plato no tiene ingredientes configurados
                        </p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Cuenta <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.account || ''}
                        onChange={(e) => onInputChange('account', parseInt(e.target.value, 10))}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.account ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                    >
                        <option value="">Seleccionar cuenta</option>
                        {accounts.map(account => (
                            <option key={account.id} value={account.id}>
                                {account.name} (S/ {formatDecimal(account.balance)})
                            </option>
                        ))}
                    </select>
                    {errors.account && <p className="text-red-500 text-xs mt-1">{errors.account}</p>}
                    {selectedAccount && (
                        <p className="text-xs text-gray-500 mt-1">
                            Saldo actual: S/ {formatDecimal(selectedAccount.balance)}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Cantidad <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.quantity_sold || ''}
                        onChange={(e) => onInputChange('quantity_sold', parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.quantity_sold ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0"
                        disabled={isSubmitting}
                    />
                    {errors.quantity_sold && (
                        <p className="text-red-500 text-xs mt-1">{errors.quantity_sold}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Precio unitario
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.unit_price || ''}
                        onChange={(e) => onInputChange('unit_price', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={selectedDish ? formatDecimal(selectedDish.price) : '0.00'}
                        disabled={isSubmitting}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Por defecto usa el precio del plato
                    </p>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Fecha de venta <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 mb-2">
                        <motion.button
                            type="button"
                            onClick={() => handleSaleDatePreset('yesterday')}
                            disabled={isSubmitting}
                            className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                saleDatePreset === 'yesterday'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Ayer
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={() => handleSaleDatePreset('today')}
                            disabled={isSubmitting}
                            className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                saleDatePreset === 'today'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Hoy
                        </motion.button>
                    </div>
                    <input
                        type="date"
                        value={formData.sale_date}
                        onChange={(e) => {
                            onSaleDatePresetChange('custom')
                            onInputChange('sale_date', e.target.value)
                        }}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.sale_date ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                    />
                    {errors.sale_date && (
                        <p className="text-red-500 text-xs mt-1">{errors.sale_date}</p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Notas</label>
                    <input
                        type="text"
                        value={formData.notes}
                        onChange={(e) => onInputChange('notes', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej. Mesa 4"
                        disabled={isSubmitting}
                    />
                </div>

                <div className="flex items-end">
                    <div className="bg-emerald-50 rounded-lg px-4 py-2 text-right w-full">
                        <p className="text-xs text-emerald-600 font-medium">Total</p>
                        <p className="text-xl font-bold text-emerald-700">
                            S/ {formData.quantity_sold > 0 ? formatDecimal(total) : '—'}
                        </p>
                        {toppingsExtra > 0 && (
                            <p className="text-xs text-emerald-600 mt-0.5">
                                Plato S/ {formatDecimal(dishSubtotal)} + toppings S/ {formatDecimal(toppingsExtra)}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {toppings.length > 0 && (
                <div className="mt-6 pt-5 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900">Toppings (opcional)</h3>
                        <motion.button
                            type="button"
                            onClick={onAddTopping}
                            disabled={isSubmitting}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-orange-50 text-orange-700 rounded-lg font-medium hover:bg-orange-100 transition-colors disabled:opacity-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Agregar topping
                        </motion.button>
                    </div>

                    {formData.toppings.length === 0 ? (
                        <p className="text-sm text-gray-500">Sin toppings adicionales</p>
                    ) : (
                        <div className="space-y-2">
                            {formData.toppings.map((line, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
                                    <div className="md:col-span-7">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Topping</label>
                                        <select
                                            value={line.topping || ''}
                                            onChange={(e) => onToppingChange(index, 'topping', parseInt(e.target.value, 10))}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Seleccionar</option>
                                            {toppings.map(topping => (
                                                <option key={topping.id} value={topping.id}>
                                                    {topping.name} — S/ {formatDecimal(topping.price)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Cantidad</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={line.quantity || ''}
                                            onChange={(e) => onToppingChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                            placeholder="1"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex justify-end">
                                        <motion.button
                                            type="button"
                                            onClick={() => onRemoveTopping(index)}
                                            disabled={isSubmitting}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="flex justify-end mt-4">
                <motion.button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="px-5 py-2 text-sm bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{isSubmitting ? 'Registrando...' : 'Registrar venta'}</span>
                </motion.button>
            </div>
        </motion.div>
    )
}

export default SaleForm
