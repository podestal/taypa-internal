import { motion } from 'framer-motion'
import { Loader2, X } from 'lucide-react'
import type { CreateUpdateCategory } from '../../../services/api/categoryService'

interface Props {
  formData: CreateUpdateCategory
  errors: { name: string; description: string }
  isSubmitting: boolean
  isEditing: boolean
  onInputChange: (field: keyof CreateUpdateCategory, value: string | boolean) => void
  onSubmit: () => void
  onCancel: () => void
}

const CategoriesPageForm = ({
  formData,
  errors,
  isSubmitting,
  isEditing,
  onInputChange,
  onSubmit,
  onCancel
}: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">
          {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
        </h2>
        {isEditing && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-end gap-3">
        <div className="flex-1">
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
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Descripción (opcional)"
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        <div className="flex items-center gap-4 px-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => onInputChange('is_active', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <span className="text-sm text-gray-700">Activa</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_menu_category}
              onChange={(e) => onInputChange('is_menu_category', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <span className="text-sm text-gray-700">Menú</span>
          </label>
        </div>

        <div className="flex gap-2">
          {isEditing && (
            <motion.button
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancelar
            </motion.button>
          )}
          <motion.button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isSubmitting ? (isEditing ? 'Actualizando...' : 'Creando...') : (isEditing ? 'Actualizar' : 'Crear')}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default CategoriesPageForm

