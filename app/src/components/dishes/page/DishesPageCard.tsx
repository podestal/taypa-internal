import { motion } from 'framer-motion'
import { Edit2, Trash2 } from 'lucide-react'
import type { Dish } from '../../../services/api/dishService'
import type { Category } from '../../../services/api/categoryService'

interface Props {
  dish: Dish
  index: number
  category: Category | undefined
  onEdit: (dish: Dish) => void
  onDelete: (dish: Dish) => void
  isDeleting: boolean
}

const DishesPageCard = ({ dish, index, category, onEdit, onDelete, isDeleting }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{dish.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{dish.description || 'Sin descripción'}</p>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-blue-600">
              S/ {dish.price}
            </span>
            {category && (
              <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                {category.name}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`px-2 py-1 text-xs font-medium rounded ${
          dish.is_active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {dish.is_active ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
        <motion.button
          onClick={() => onEdit(dish)}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Edit2 className="w-4 h-4" />
          <span>Editar</span>
        </motion.button>
        <motion.button
          onClick={() => onDelete(dish)}
          disabled={isDeleting}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Trash2 className="w-4 h-4" />
          <span>Eliminar</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default DishesPageCard

