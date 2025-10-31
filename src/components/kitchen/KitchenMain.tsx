import { motion } from 'framer-motion'
import { ChefHat } from 'lucide-react'
import KitchenOrderList from './KitchenOrderList'

const KitchenMain = () => {

  return (
    <div className="h-full bg-gray-50">
      <div className="p-6">
        <motion.div
          className="flex items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ChefHat className="w-8 h-8 text-orange-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Cocina</h1>
        </motion.div>
        <KitchenOrderList />
      </div>
    </div>
  )
}

export default KitchenMain