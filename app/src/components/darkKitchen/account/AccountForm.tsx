import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import type { CreateKitchenAccount } from '../../../services/kitchen/accountService'

interface FormErrors {
    name: string
    balance: string
}

interface Props {
    formData: CreateKitchenAccount
    errors: FormErrors
    isSubmitting: boolean
    isEditing?: boolean
    onInputChange: (field: keyof CreateKitchenAccount, value: string | number | boolean) => void
    onSubmit: () => void
    onCancel?: () => void
}

const AccountForm = ({
    formData,
    errors,
    isSubmitting,
    isEditing = false,
    onInputChange,
    onSubmit,
    onCancel,
}: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-5 border border-gray-200"
        >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {isEditing ? 'Editar cuenta' : 'Nueva cuenta'}
            </h2>

            <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => onInputChange('name', e.target.value)}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ej. Caja, BCP, Yape..."
                        disabled={isSubmitting}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div className="w-full sm:w-40">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        {isEditing ? 'Saldo' : 'Saldo inicial'} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={isEditing ? formData.balance : (formData.balance === 0 ? '' : formData.balance)}
                        onChange={(e) => onInputChange('balance', parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.balance ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                        disabled={isSubmitting}
                    />
                    {errors.balance && <p className="text-red-500 text-xs mt-1">{errors.balance}</p>}
                </div>

                {isEditing && (
                    <label className="flex items-center gap-2 cursor-pointer pb-2">
                        <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) => onInputChange('is_active', e.target.checked)}
                            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            disabled={isSubmitting}
                        />
                        <span className="text-sm text-gray-700">Activa</span>
                    </label>
                )}

                <div className="flex items-center gap-2">
                    {isEditing && onCancel && (
                        <motion.button
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="px-5 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancelar
                        </motion.button>
                    )}
                    <motion.button
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="px-5 py-2 text-sm bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>
                            {isSubmitting
                                ? (isEditing ? 'Actualizando...' : 'Creando...')
                                : (isEditing ? 'Actualizar cuenta' : 'Crear cuenta')}
                        </span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

export default AccountForm
