import { motion } from 'framer-motion'
import { UtensilsCrossed, Trash2, Edit2 } from 'lucide-react'
import type { KitchenDish } from '../../../services/kitchen/dishService'
import type { KitchenCategory } from '../../../services/kitchen/categoryService'
import type { Product } from '../../../services/kitchen/productService'
import { formatDecimal } from '../../../utils/inventoryHelpers'

interface Props {
    dish: KitchenDish
    categories: KitchenCategory[]
    products: Product[]
    index: number
    onEdit?: (dish: KitchenDish) => void
    onDeactivate?: (dish: KitchenDish) => void
    isDeactivating?: boolean
}

const DishCard = ({ dish, categories, products, index, onEdit, onDeactivate, isDeactivating }: Props) => {
    const categoryName =
        dish.category_name ??
        categories.find(c => c.id === dish.category)?.name ??
        `Categoría #${dish.category}`

    const getProductName = (productId: number, productName?: string) =>
        productName ?? products.find(p => p.id === productId)?.name ?? `Producto #${productId}`

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className={`bg-white rounded-lg shadow-md p-5 border hover:shadow-lg transition-shadow ${
                dish.is_active ? 'border-gray-200' : 'border-gray-200 opacity-60'
            }`}
        >
            <div className="flex items-start gap-3 mb-4">
                <div className={`p-2 rounded-lg ${dish.is_active ? 'bg-orange-50' : 'bg-gray-100'}`}>
                    <UtensilsCrossed className={`w-5 h-5 ${dish.is_active ? 'text-orange-600' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900">{dish.name}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                            dish.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                            {dish.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{categoryName}</p>
                    {dish.description && (
                        <p className="text-sm text-gray-600 mt-1">{dish.description}</p>
                    )}
                </div>
                <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-orange-600">S/ {formatDecimal(dish.price)}</p>
                    {dish.points != null && (
                        <p className="mt-0.5 text-xs font-medium text-indigo-600">
                            {formatDecimal(dish.points)} puntos
                        </p>
                    )}
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-500 mb-2">Ingredientes</p>
                {dish.ingredients.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">Sin ingredientes</p>
                ) : (
                    <ul className="space-y-1">
                        {dish.ingredients.map((ingredient, i) => (
                            <li key={ingredient.id ?? i} className="flex justify-between text-sm">
                                <span className="text-gray-700">
                                    {getProductName(ingredient.product, ingredient.product_name)}
                                </span>
                                <span className="font-medium text-gray-900">
                                    {formatDecimal(ingredient.quantity)}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {(onEdit || (dish.is_active && onDeactivate)) && (
                <div className="flex gap-2 mt-4">
                    {onEdit && (
                        <motion.button
                            onClick={() => onEdit(dish)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <Edit2 className="w-4 h-4" />
                            <span>Editar</span>
                        </motion.button>
                    )}
                    {dish.is_active && onDeactivate && (
                        <motion.button
                            onClick={() => onDeactivate(dish)}
                            disabled={isDeactivating}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
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

export default DishCard
