import { motion } from "framer-motion"
import type { Dish } from "../../services/api/dishService"
import CreateOrderItem from "../orderItem/CreateOrderItem"

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
        <CreateOrderItem dish={dish} />
    </motion.div>
  )
}

export default DishCard