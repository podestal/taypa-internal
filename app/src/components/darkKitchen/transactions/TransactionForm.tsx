import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import type { KitchenAccount } from '../../../services/kitchen/accountService'
import type { KitchenCategory } from '../../../services/kitchen/categoryService'
import type { TransactionType } from '../../../services/kitchen/transactionService'
import { formatDecimal, todayISO, yesterdayISO } from '../../../utils/inventoryHelpers'
import type { TransactionDatePreset, TransactionFormState } from '../../../utils/transactionHelpers'
import { TRANSACTION_TYPE_LABELS } from '../../../utils/transactionHelpers'

interface FormErrors {
    account: string
    amount: string
    transaction_date: string
}

interface Props {
    formData: TransactionFormState
    errors: FormErrors
    accounts: KitchenAccount[]
    categories: KitchenCategory[]
    transactionDatePreset: TransactionDatePreset
    isSubmitting: boolean
    isEditing?: boolean
    onInputChange: (field: keyof TransactionFormState, value: string | number) => void
    onTransactionDatePresetChange: (preset: TransactionDatePreset) => void
    onSubmit: () => void
    onCancel?: () => void
}

const TransactionForm = ({
    formData,
    errors,
    accounts,
    categories,
    transactionDatePreset,
    isSubmitting,
    isEditing = false,
    onInputChange,
    onTransactionDatePresetChange,
    onSubmit,
    onCancel,
}: Props) => {
    const handleTypeChange = (type: TransactionType) => {
        onInputChange('transaction_type', type)
    }

    const handleDatePreset = (preset: 'today' | 'yesterday') => {
        onTransactionDatePresetChange(preset)
        onInputChange('transaction_date', preset === 'today' ? todayISO() : yesterdayISO())
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-5 border border-gray-200"
        >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {isEditing ? 'Editar transacción' : 'Nueva transacción'}
            </h2>

            <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Tipo</p>
                <div className="flex gap-2">
                    {(['E', 'I'] as TransactionType[]).map(type => (
                        <motion.button
                            key={type}
                            type="button"
                            onClick={() => handleTypeChange(type)}
                            disabled={isSubmitting}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                formData.transaction_type === type
                                    ? type === 'E'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-emerald-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {TRANSACTION_TYPE_LABELS[type]}
                        </motion.button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Cuenta <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.account || ''}
                        onChange={(e) => onInputChange('account', parseInt(e.target.value, 10))}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
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
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Categoría
                    </label>
                    <select
                        value={formData.category || ''}
                        onChange={(e) => onInputChange('category', parseInt(e.target.value, 10) || 0)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={isSubmitting}
                    >
                        <option value="">Sin categoría</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Monto <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.amount || ''}
                        onChange={(e) => onInputChange('amount', parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                            errors.amount ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                        disabled={isSubmitting}
                    />
                    {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Fecha <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 mb-2">
                        <motion.button
                            type="button"
                            onClick={() => handleDatePreset('yesterday')}
                            disabled={isSubmitting}
                            className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                transactionDatePreset === 'yesterday'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Ayer
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={() => handleDatePreset('today')}
                            disabled={isSubmitting}
                            className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                transactionDatePreset === 'today'
                                    ? 'bg-indigo-600 text-white'
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
                        value={formData.transaction_date}
                        onChange={(e) => {
                            onTransactionDatePresetChange('custom')
                            onInputChange('transaction_date', e.target.value)
                        }}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                            errors.transaction_date ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                    />
                    {errors.transaction_date && (
                        <p className="text-red-500 text-xs mt-1">{errors.transaction_date}</p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Descripción
                    </label>
                    <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => onInputChange('description', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ej. EDEA - June"
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
                {isEditing && onCancel && (
                    <motion.button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-5 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Cancelar
                    </motion.button>
                )}
                <motion.button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>
                        {isSubmitting
                            ? (isEditing ? 'Guardando...' : 'Registrando...')
                            : (isEditing ? 'Guardar cambios' : 'Registrar transacción')}
                    </span>
                </motion.button>
            </div>
        </motion.div>
    )
}

export default TransactionForm
