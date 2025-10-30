import { motion } from "framer-motion"
import DishList from "./DishList"

interface Props {
  categoryId: number
}

const DishesMain = ({ categoryId }: Props) => {

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <DishList categoryId={categoryId} />
      </motion.div>
  )
}

export default DishesMain