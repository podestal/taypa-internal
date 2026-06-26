import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import type { Product } from '../../../services/kitchen/productService'
import type { KitchenAccount } from '../../../services/kitchen/accountService'
import { formatDecimal, todayISO, yesterdayISO } from '../../../utils/inventoryHelpers'
import type { PurchaseFormState, PurchaseDatePreset } from '../../../utils/purchaseHelpers'
import { unitPriceFromTotal } from '../../../utils/purchaseHelpers'

interface FormErrors {
    product: string
    account: string
    quantity_bought: string
    total_price: string
    purchase_date: string
}

interface Props {
    formData: PurchaseFormState
    errors: FormErrors
    products: Product[]
    accounts: KitchenAccount[]
    purchaseDatePreset: PurchaseDatePreset
    isSubmitting: boolean
    onInputChange: (field: keyof PurchaseFormState, value: string | number) => void
    onPurchaseDatePresetChange: (preset: PurchaseDatePreset) => void
    onSubmit: () => void
}

const PurchaseForm = ({
    formData,
    errors,
    products,
    accounts,
    purchaseDatePreset,
    isSubmitting,
    onInputChange,
    onPurchaseDatePresetChange,
    onSubmit,
}: Props) => {
    const unitPrice = unitPriceFromTotal(formData.total_price, formData.quantity_bought)
    const selectedAccount = accounts.find(a => a.id === formData.account)

    const handlePurchaseDatePreset = (preset: 'today' | 'yesterday') => {
        onPurchaseDatePresetChange(preset)
        onInputChange('purchase_date', preset === 'today' ? todayISO() : yesterdayISO())
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-5 border border-gray-200"
        >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Nueva compra</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Producto <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.product || ''}
                        onChange={(e) => onInputChange('product', parseInt(e.target.value, 10))}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                            errors.product ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                    >
                        <option value="">Seleccionar producto</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                    </select>
                    {errors.product && <p className="text-red-500 text-xs mt-1">{errors.product}</p>}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Cuenta <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.account || ''}
                        onChange={(e) => onInputChange('account', parseInt(e.target.value, 10))}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
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
                            Saldo disponible: S/ {formatDecimal(selectedAccount.balance)}
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
                        value={formData.quantity_bought || ''}
                        onChange={(e) => onInputChange('quantity_bought', parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                            errors.quantity_bought ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0"
                        disabled={isSubmitting}
                    />
                    {errors.quantity_bought && (
                        <p className="text-red-500 text-xs mt-1">{errors.quantity_bought}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Precio total <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.total_price || ''}
                        onChange={(e) => onInputChange('total_price', parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                            errors.total_price ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                        disabled={isSubmitting}
                    />
                    {errors.total_price && (
                        <p className="text-red-500 text-xs mt-1">{errors.total_price}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Fecha de compra <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 mb-2">
                        <motion.button
                            type="button"
                            onClick={() => handlePurchaseDatePreset('yesterday')}
                            disabled={isSubmitting}
                            className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                purchaseDatePreset === 'yesterday'
                                    ? 'bg-violet-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Ayer
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={() => handlePurchaseDatePreset('today')}
                            disabled={isSubmitting}
                            className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                purchaseDatePreset === 'today'
                                    ? 'bg-violet-600 text-white'
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
                        value={formData.purchase_date}
                        onChange={(e) => {
                            onPurchaseDatePresetChange('custom')
                            onInputChange('purchase_date', e.target.value)
                        }}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                            errors.purchase_date ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                    />
                    {errors.purchase_date && (
                        <p className="text-red-500 text-xs mt-1">{errors.purchase_date}</p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Notas</label>
                    <input
                        type="text"
                        value={formData.notes}
                        onChange={(e) => onInputChange('notes', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                        placeholder="Opcional"
                        disabled={isSubmitting}
                    />
                </div>

                <div className="flex items-end">
                    <div className="bg-violet-50 rounded-lg px-4 py-2 text-right w-full">
                        <p className="text-xs text-violet-600 font-medium">Precio unitario</p>
                        <p className="text-xl font-bold text-violet-700">
                            S/ {formData.quantity_bought > 0 ? formatDecimal(unitPrice) : '—'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-4">
                <motion.button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="px-5 py-2 text-sm bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{isSubmitting ? 'Registrando...' : 'Registrar compra'}</span>
                </motion.button>
            </div>
        </motion.div>
    )
}

export default PurchaseForm
