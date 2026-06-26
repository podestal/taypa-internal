import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import type { CreateUpdateProduct, ProductType } from '../../../services/kitchen/productService'
import { PRODUCT_TYPE_LABELS } from '../../../utils/productHelpers'

interface FormErrors {
    name: string
    quantity: string
}

interface Props {
    formData: CreateUpdateProduct
    errors: FormErrors
    isSubmitting: boolean
    onInputChange: (field: keyof CreateUpdateProduct, value: string | number | null) => void
    onSubmit: () => void
}

const ProductForm = ({
    formData,
    errors,
    isSubmitting,
    onInputChange,
    onSubmit,
}: Props) => {
    const handleOptionalDecimal = (field: 'weight' | 'volume', value: string) => {
        if (value.trim() === '') {
            onInputChange(field, null)
            return
        }
        const parsed = parseFloat(value)
        onInputChange(field, isNaN(parsed) ? null : parsed)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-5 border border-gray-200"
        >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Nuevo Producto</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        placeholder="Nombre del producto"
                        disabled={isSubmitting}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Tipo <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.product_type}
                        onChange={(e) => onInputChange('product_type', e.target.value as ProductType)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isSubmitting}
                    >
                        {(Object.keys(PRODUCT_TYPE_LABELS) as ProductType[]).map(type => (
                            <option key={type} value={type}>{PRODUCT_TYPE_LABELS[type]}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Cantidad
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.quantity}
                        onChange={(e) => onInputChange('quantity', parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.quantity ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0"
                        disabled={isSubmitting}
                    />
                    {errors.quantity && (
                        <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Peso
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.weight ?? ''}
                        onChange={(e) => handleOptionalDecimal('weight', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Opcional"
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Volumen
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.volume ?? ''}
                        onChange={(e) => handleOptionalDecimal('volume', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Opcional"
                        disabled={isSubmitting}
                    />
                </div>

                <div className="md:col-span-2 lg:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Descripción
                    </label>
                    <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => onInputChange('description', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Descripción (opcional)"
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            <div className="flex justify-end mt-4">
                <motion.button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{isSubmitting ? 'Creando...' : 'Crear producto'}</span>
                </motion.button>
            </div>
        </motion.div>
    )
}

export default ProductForm
