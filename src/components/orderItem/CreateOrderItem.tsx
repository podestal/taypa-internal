import { motion } from "framer-motion"
import type { Dish } from "../../services/api/dishService"

interface Props {
  orderId: number
  dish: Dish
}

const CreateOrderItem = ({ orderId, dish }: Props) => {

    console.log('dish', dish);
    console.log('orderId', orderId);
  
  return (
    <motion.button
        // onClick={() => addItemToOrder(item, categories.find(c => c.id === selectedCategory)?.name || '')}
        className="px-3 py-1 cursor-pointer bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        >
        Agregar
    </motion.button>
  )
}

export default CreateOrderItem