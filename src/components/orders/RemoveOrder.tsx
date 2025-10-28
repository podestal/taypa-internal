import { motion } from "framer-motion"


const RemoveOrder = () => {


    const handleRemoveOrder = () => {
        console.log('remove order')
    }
  return (
    <motion.button
        onClick={handleRemoveOrder}
        className="mb-6 cursor-pointer flex items-center text-red-600 hover:text-red-800 font-medium"
        whileHover={{ scale: 1.02 }}
    >
        Cancelar orden
    </motion.button>
  )
}

export default RemoveOrder