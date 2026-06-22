import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2, X, Image as ImageIcon, XCircle } from 'lucide-react'
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
  onImageChange: (file: File | null) => void
  imagePreview: string | null
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
  onImageChange,
  imagePreview,
  onSubmit,
  onCancel,
  isModal = false
}: Props): ReactElement => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onImageChange(file)
  }

  const handleRemoveImage = () => {
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  const formContent = (
    <>
      <div className="flex items-center justify-between mb-6">
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

      <div className="space-y-6">
        {/* Basic Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nombre del plato"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => onInputChange('price', parseFloat(e.target.value) || 0)}
              className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
              disabled={isSubmitting}
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1.5">{errors.price}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => onInputChange('category', parseInt(e.target.value))}
              className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
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
              <p className="text-red-500 text-xs mt-1.5">{errors.category}</p>
            )}
          </div>

          <div className="flex items-end">
            <label className="flex items-center space-x-2 cursor-pointer p-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => onInputChange('is_active', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <span className="text-sm font-medium text-gray-700">Activo</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Descripción del plato (opcional)"
            disabled={isSubmitting}
          />
        </div>

        {/* Image Upload Section */}
        <div className="flex flex-col items-center justify-center gap-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen
          </label>
          {imagePreview ? (
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-w-md h-64 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isSubmitting}
                className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 shadow-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full max-w-md h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 bg-gray-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold text-blue-600">Click para subir</span> o arrastra y suelta
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, GIF hasta 10MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={isSubmitting}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-10 pt-2">
          {isEditing && (
            <motion.button
              onClick={onCancel}
              disabled={isSubmitting}
              className=" px-6 py-2.5 text-sm bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancelar
            </motion.button>
          )}
          <motion.button
            onClick={onSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2.5 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm`}
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

