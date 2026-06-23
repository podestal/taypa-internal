import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import type { CreateKitchenTopping } from '../../../services/kitchen/toppingService'
import type { Product } from '../../../services/kitchen/productService'

interface FormErrors {
    name: string
    price: string
    product: string
    quantity: string
}

interface Props {
    formData: CreateKitchenTopping
    errors: FormErrors
    products: Product[]
    isSubmitting: boolean
    isEditing?: boolean
    onInputChange: (field: keyof CreateKitchenTopping, value: string | number | boolean) => void
    onSubmit: () => void
    onCancel?: () => void
}

const ToppingForm = ({
    formData,
    errors,
    products,
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
                {isEditing ? 'Editar topping' : 'Nuevo topping'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => onInputChange('name', e.target.value)}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ej. Queso extra"
                        disabled={isSubmitting}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                            errors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                        disabled={isSubmitting}
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Producto <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.product || ''}
                        onChange={(e) => onInputChange('product', parseInt(e.target.value, 10))}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500 ${
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

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Consumo por unidad <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.quantity || ''}
                        onChange={(e) => onInputChange('quantity', parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                            errors.quantity ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                        disabled={isSubmitting}
                    />
                    {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                    <p className="text-xs text-gray-500 mt-1">Cantidad de producto usada por topping</p>
                </div>

                <div className="flex items-center justify-end gap-4 md:col-span-2 lg:col-span-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) => onInputChange('is_active', e.target.checked)}
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                            disabled={isSubmitting}
                        />
                        <span className="text-sm text-gray-700">Activo</span>
                    </label>

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
                            className="px-5 py-2 text-sm bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>
                                {isSubmitting
                                    ? (isEditing ? 'Actualizando...' : 'Creando...')
                                    : (isEditing ? 'Actualizar topping' : 'Crear topping')}
                            </span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default ToppingForm
