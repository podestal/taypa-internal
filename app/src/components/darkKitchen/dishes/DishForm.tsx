import { motion } from 'framer-motion'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import type { Product } from '../../../services/kitchen/productService'
import type { KitchenCategory } from '../../../services/kitchen/categoryService'
import type { DishFormState, DishFormIngredient } from '../../../utils/dishHelpers'

interface FormErrors {
    name: string
    price: string
    category: string
    ingredients: string
}

interface Props {
    formData: DishFormState
    errors: FormErrors
    products: Product[]
    categories: KitchenCategory[]
    isSubmitting: boolean
    isEditing?: boolean
    onInputChange: (field: keyof Omit<DishFormState, 'ingredients'>, value: string | number | boolean | null) => void
    onIngredientChange: (index: number, field: keyof DishFormIngredient, value: number) => void
    onAddIngredient: () => void
    onRemoveIngredient: (index: number) => void
    onSubmit: () => void
    onCancel?: () => void
}

const DishForm = ({
    formData,
    errors,
    products,
    categories,
    isSubmitting,
    isEditing = false,
    onInputChange,
    onIngredientChange,
    onAddIngredient,
    onRemoveIngredient,
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
                {isEditing ? 'Editar plato' : 'Nuevo plato'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => onInputChange('name', e.target.value)}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nombre del plato"
                        disabled={isSubmitting}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Puntos
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.points ?? ''}
                        onChange={(e) => onInputChange(
                            'points',
                            e.target.value === '' ? null : parseFloat(e.target.value),
                        )}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Opcional"
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Precio <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.price || ''}
                        onChange={(e) => onInputChange('price', parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                        disabled={isSubmitting}
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Categoría <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.category || ''}
                        onChange={(e) => onInputChange('category', parseInt(e.target.value, 10))}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                    >
                        <option value="">Seleccionar categoría</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>

                <div className="md:col-span-2 lg:col-span-4">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Descripción</label>
                    <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => onInputChange('description', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Opcional"
                        disabled={isSubmitting}
                    />
                </div>

                <label className="flex items-center gap-2 cursor-pointer pb-2">
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

            <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">
                        Ingredientes <span className="text-red-500">*</span>
                    </h3>
                    <button
                        type="button"
                        onClick={onAddIngredient}
                        disabled={isSubmitting}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                    >
                        <Plus className="w-4 h-4" />
                        Agregar ingrediente
                    </button>
                </div>

                {errors.ingredients && (
                    <p className="text-red-500 text-xs mb-2">{errors.ingredients}</p>
                )}

                <div className="space-y-2">
                    {formData.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex gap-2 items-start">
                            <select
                                value={ingredient.product || ''}
                                onChange={(e) => onIngredientChange(index, 'product', parseInt(e.target.value, 10))}
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                disabled={isSubmitting}
                            >
                                <option value="">Producto</option>
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>{product.name}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={ingredient.quantity || ''}
                                onChange={(e) => onIngredientChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                className="w-28 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Cant."
                                disabled={isSubmitting}
                            />
                            {formData.ingredients.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => onRemoveIngredient(index)}
                                    disabled={isSubmitting}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
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
                    className="px-5 py-2 text-sm bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>
                        {isSubmitting
                            ? (isEditing ? 'Actualizando...' : 'Creando...')
                            : (isEditing ? 'Actualizar plato' : 'Crear plato')}
                    </span>
                </motion.button>
            </div>
        </motion.div>
    )
}

export default DishForm
