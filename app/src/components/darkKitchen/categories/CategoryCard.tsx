import { motion } from 'framer-motion'
import { Tag, Trash2, Pencil } from 'lucide-react'
import type { KitchenCategory } from '../../../services/kitchen/categoryService'

interface Props {
    category: KitchenCategory
    index: number
    onEdit?: (category: KitchenCategory) => void
    onDeactivate?: (category: KitchenCategory) => void
    isDeactivating?: boolean
}

const CategoryCard = ({ category, index, onEdit, onDeactivate, isDeactivating }: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-lg shadow-md p-5 border hover:shadow-lg transition-shadow ${
                category.is_active ? 'border-gray-200' : 'border-gray-200 opacity-60'
            }`}
        >
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${category.is_active ? 'bg-blue-50' : 'bg-gray-100'}`}>
                    <Tag className={`w-5 h-5 ${category.is_active ? 'text-blue-600' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{category.name}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                            category.is_active
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-600'
                        }`}>
                            {category.is_active ? 'Activa' : 'Inactiva'}
                        </span>
                    </div>
                    {category.description ? (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{category.description}</p>
                    ) : (
                        <p className="text-sm text-gray-400 mt-1 italic">Sin descripción</p>
                    )}
                </div>
            </div>

            {(onEdit || (category.is_active && onDeactivate)) && (
                <div className="mt-4 flex gap-2">
                    {onEdit && (
                        <motion.button
                            onClick={() => onEdit(category)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <Pencil className="w-4 h-4" />
                            <span>Editar</span>
                        </motion.button>
                    )}
                    {category.is_active && onDeactivate && (
                        <motion.button
                            onClick={() => onDeactivate(category)}
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

export default CategoryCard
