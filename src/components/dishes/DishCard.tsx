import { motion } from "framer-motion"
import type { Dish } from "../../services/api/dishService"

interface Props {
    dish: Dish
    index: number
}

const DishCard = ({ dish, index }: Props) => {
  return (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
    >
        <div>
        <div className="font-medium text-gray-900">{dish.name}</div>
        <div className="text-sm text-gray-600">${dish.price}</div>
        </div>
        <motion.button
        // onClick={() => addItemToOrder(item, categories.find(c => c.id === selectedCategory)?.name || '')}
        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        >
        Agregar
        </motion.button>
    </motion.div>
  )
}

export default DishCard