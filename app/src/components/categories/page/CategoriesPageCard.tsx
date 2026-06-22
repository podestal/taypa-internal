import { motion } from 'framer-motion'
import { Edit2, Trash2 } from 'lucide-react'
import type { Category } from '../../../services/api/categoryService'

interface Props {
  category: Category
  index: number
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  isDeleting: boolean
}

const CategoriesPageCard = ({ category, index, onEdit, onDelete, isDeleting }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
          <p className="text-sm text-gray-600">{category.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`px-2 py-1 text-xs font-medium rounded ${
          category.is_active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {category.is_active ? 'Activa' : 'Inactiva'}
        </span>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
        <motion.button
          onClick={() => onEdit(category)}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Edit2 className="w-4 h-4" />
          <span>Editar</span>
        </motion.button>
        <motion.button
          onClick={() => onDelete(category)}
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

export default CategoriesPageCard

