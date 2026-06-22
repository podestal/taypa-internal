import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import type { CreateInventoryMovement, MovementSource } from '../../../services/kitchen/inventoryService'
import type { Product } from '../../../services/kitchen/productService'
import { MANUAL_MOVEMENT_SOURCES, MOVEMENT_SOURCE_LABELS, todayISO } from '../../../utils/inventoryHelpers'

interface FormErrors {
    product: string
    quantity: string
    movement_date: string
}

interface Props {
    formData: CreateInventoryMovement
    errors: FormErrors
    products: Product[]
    isSubmitting: boolean
    onInputChange: (field: keyof CreateInventoryMovement, value: string | number) => void
    onSourceChange: (source: MovementSource) => void
    onSubmit: () => void
}

const MovementForm = ({
    formData,
    errors,
    products,
    isSubmitting,
    onInputChange,
    onSourceChange,
    onSubmit,
}: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-5 border border-gray-200"
        >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Registrar movimiento</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Producto <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.product || ''}
                        onChange={(e) => onInputChange('product', parseInt(e.target.value, 10))}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                        Tipo <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.source}
                        onChange={(e) => onSourceChange(e.target.value as MovementSource)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isSubmitting}
                    >
                        {MANUAL_MOVEMENT_SOURCES.map(source => (
                            <option key={source} value={source}>
                                {MOVEMENT_SOURCE_LABELS[source]}
                            </option>
                        ))}
                    </select>
                </div>

                {formData.source === 'ADJUSTMENT' && (
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Dirección <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.movement_type}
                            onChange={(e) => onInputChange('movement_type', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={isSubmitting}
                        >
                            <option value="IN">Entrada</option>
                            <option value="OUT">Salida</option>
                        </select>
                    </div>
                )}

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Cantidad <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.quantity || ''}
                        onChange={(e) => onInputChange('quantity', parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.quantity ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0"
                        disabled={isSubmitting}
                    />
                    {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Fecha <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={formData.movement_date}
                        onChange={(e) => onInputChange('movement_date', e.target.value)}
                        max={todayISO()}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.movement_date ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                    />
                    {errors.movement_date && <p className="text-red-500 text-xs mt-1">{errors.movement_date}</p>}
                </div>

                <div className="md:col-span-2 lg:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Notas</label>
                    <input
                        type="text"
                        value={formData.notes}
                        onChange={(e) => onInputChange('notes', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Opcional"
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
                    <span>{isSubmitting ? 'Registrando...' : 'Registrar movimiento'}</span>
                </motion.button>
            </div>
        </motion.div>
    )
}

export default MovementForm
