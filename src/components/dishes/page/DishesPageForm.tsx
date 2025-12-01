import { motion } from 'framer-motion'
import { Loader2, X } from 'lucide-react'
import type { CreateUpdateDish } from '../../../services/api/dishService'
import type { Category } from '../../../services/api/categoryService'
import type { ReactElement } from 'react'

interface Props {
  formData: CreateUpdateDish
  errors: { name: string; price: string; category: string }
  isSubmitting: boolean
  isEditing: boolean
  categories: Category[]
  onInputChange: (field: keyof CreateUpdateDish, value: string | number | boolean) => void
  onSubmit: () => void
  onCancel: () => void
  isModal?: boolean
}

const DishesPageForm = ({
  formData,
  errors,
  isSubmitting,
  isEditing,
  categories,
  onInputChange,
  onSubmit,
  onCancel,
  isModal = false
}: Props): ReactElement => {
  const formContent = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? 'Editar Plato' : 'Nuevo Plato'}
        </h2>
        {isEditing && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className={isModal ? "space-y-4" : "flex items-end gap-3"}>
        <div className={isModal ? "w-full" : "flex-1"}>
          <label className={`block font-medium text-gray-700 mb-1 ${isModal ? 'text-sm' : 'text-xs'}`}>
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nombre del plato"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div className={isModal ? "w-full" : "flex-1"}>
          <label className={`block font-medium text-gray-700 mb-1 ${isModal ? 'text-sm' : 'text-xs'}`}>
            Descripción
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Descripción (opcional)"
            disabled={isSubmitting}
          />
        </div>

        <div className={isModal ? "w-full" : "w-32"}>
          <label className={`block font-medium text-gray-700 mb-1 ${isModal ? 'text-sm' : 'text-xs'}`}>
            Precio <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => onInputChange('price', parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
            disabled={isSubmitting}
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price}</p>
          )}
        </div>

        <div className={isModal ? "w-full" : "w-48"}>
          <label className={`block font-medium text-gray-700 mb-1 ${isModal ? 'text-sm' : 'text-xs'}`}>
            Categoría <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => onInputChange('category', parseInt(e.target.value))}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          >
            <option value="">Seleccionar categoría</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
          )}
        </div>

        <div className={`flex items-center ${isModal ? 'w-full' : 'px-3'}`}>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => onInputChange('is_active', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <span className="text-sm text-gray-700">Activo</span>
          </label>
        </div>

        <div className={`flex gap-2 ${isModal ? 'w-full pt-2' : ''}`}>
          {isEditing && (
            <motion.button
              onClick={onCancel}
              disabled={isSubmitting}
              className={`${isModal ? 'flex-1' : ''} px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancelar
            </motion.button>
          )}
          <motion.button
            onClick={onSubmit}
            disabled={isSubmitting}
            className={`${isModal ? 'flex-1' : ''} px-4 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isSubmitting ? (isEditing ? 'Actualizando...' : 'Creando...') : (isEditing ? 'Actualizar' : 'Crear')}</span>
          </motion.button>
        </div>
      </div>
    </>
  )

  if (isModal) {
    return formContent
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
    >
      {formContent}
    </motion.div>
  )
}

export default DishesPageForm

