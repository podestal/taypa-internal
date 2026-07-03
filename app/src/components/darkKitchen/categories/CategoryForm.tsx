import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import {
    MENU_ITEM_LABELS,
    type CategoryFormState,
} from '../../../utils/categoryHelpers'

interface FormErrors {
    name: string
    description: string
}

interface Props {
    formData: CategoryFormState
    errors: FormErrors
    isSubmitting: boolean
    isEditing?: boolean
    onInputChange: (field: keyof CategoryFormState, value: string | boolean) => void
    onMenuItemTypeChange?: (isMenu: boolean) => void
    onSubmit: () => void
    onCancel?: () => void
}

const CategoryForm = ({
    formData,
    errors,
    isSubmitting,
    isEditing = false,
    onInputChange,
    onMenuItemTypeChange,
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
                {isEditing ? 'Editar categoría' : 'Nueva categoría'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <div>
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
                        placeholder="Nombre de la categoría"
                        disabled={isSubmitting}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Descripción
                        {!formData.menu_item && <span className="text-red-500"> *</span>}
                        {!formData.menu_item && (
                            <span className="text-gray-400 font-normal"> (ej. Gas)</span>
                        )}
                    </label>
                    <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => onInputChange('description', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={formData.menu_item ? 'No aplica para menú' : 'Ej. Gas'}
                        disabled={isSubmitting || formData.menu_item}
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Tipo
                    </label>
                    <select
                        value={formData.menu_item ? 'menu' : 'finance'}
                        onChange={(e) => {
                            const isMenu = e.target.value === 'menu'
                            if (onMenuItemTypeChange) {
                                onMenuItemTypeChange(isMenu)
                            } else {
                                onInputChange('menu_item', isMenu)
                                if (isMenu) onInputChange('description', '')
                            }
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isSubmitting}
                    >
                        <option value="menu">{MENU_ITEM_LABELS.menu}</option>
                        <option value="finance">{MENU_ITEM_LABELS.finance}</option>
                    </select>
                </div>

                <div className="flex items-center justify-end gap-4 md:col-span-2 lg:col-span-3">
                    {isEditing && (
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) => onInputChange('is_active', e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                            className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>
                                {isSubmitting
                                    ? (isEditing ? 'Actualizando...' : 'Creando...')
                                    : (isEditing ? 'Actualizar categoría' : 'Crear categoría')}
                            </span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default CategoryForm
