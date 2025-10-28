import { motion } from "framer-motion"
import type { Dish } from "../../services/api/dishService"
import CreateOrderItem from "../orderItem/CreateOrderItem"

interface Props {
    dish: Dish
    index: number
    orderId: number
}

const DishCard = ({ dish, index, orderId }: Props) => {
  return (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
    >
        {/* <div>
        <div className="font-medium text-gray-900">{dish.name}</div>
        <div className="text-sm text-gray-600">${dish.price}</div>
        </div> */}
        <CreateOrderItem orderId={orderId} dish={dish} />
    </motion.div>
  )
}

export default DishCard