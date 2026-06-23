import { motion } from 'framer-motion'
import { Sparkles, Pencil, Trash2 } from 'lucide-react'
import type { KitchenTopping } from '../../../services/kitchen/toppingService'
import type { Product } from '../../../services/kitchen/productService'
import { formatDecimal } from '../../../utils/inventoryHelpers'

interface Props {
    topping: KitchenTopping
    products: Product[]
    index: number
    onEdit?: (topping: KitchenTopping) => void
    onDeactivate?: (topping: KitchenTopping) => void
    isDeactivating?: boolean
}

const ToppingCard = ({ topping, products, index, onEdit, onDeactivate, isDeactivating }: Props) => {
    const productName =
        topping.product_name ??
        products.find(p => p.id === topping.product)?.name ??
        `Producto #${topping.product}`

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-lg shadow-md p-5 border hover:shadow-lg transition-shadow ${
                topping.is_active ? 'border-gray-200' : 'border-gray-200 opacity-60'
            }`}
        >
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${topping.is_active ? 'bg-orange-50' : 'bg-gray-100'}`}>
                    <Sparkles className={`w-5 h-5 ${topping.is_active ? 'text-orange-600' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{topping.name}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                            topping.is_active
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-600'
                        }`}>
                            {topping.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{productName}</p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-orange-700">S/ {formatDecimal(topping.price)}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Consumo / unidad</p>
                    <p className="font-semibold text-gray-900">{formatDecimal(topping.quantity)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Producto</p>
                    <p className="font-semibold text-gray-900 truncate">{productName}</p>
                </div>
            </div>

            {(onEdit || (topping.is_active && onDeactivate)) && (
                <div className="mt-4 flex gap-2">
                    {onEdit && (
                        <motion.button
                            onClick={() => onEdit(topping)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <Pencil className="w-4 h-4" />
                            <span>Editar</span>
                        </motion.button>
                    )}
                    {topping.is_active && onDeactivate && (
                        <motion.button
                            onClick={() => onDeactivate(topping)}
                            disabled={isDeactivating}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>{isDeactivating ? 'Desactivando...' : 'Desactivar'}</span>
                        </motion.button>
                    )}
                </div>
            )}
        </motion.div>
    )
}

export default ToppingCard
