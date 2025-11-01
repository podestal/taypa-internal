import { useState } from "react"
import OrderStatusSelector from "./OrderStatusSelector"
import OrderByStatusList from "./OrderByStatusList"
import { motion } from "framer-motion"
import { ChefHat } from "lucide-react"

const OrderByStatusMain = () => {

    const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>('IK')
    // const [showOrderStatusList, setShowOrderStatusList] = useState(false)

  return (
    <>
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <ChefHat className="w-6 h-6 text-orange-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Órdenes</h2>
              </div>
              {/* <button onClick={() => setShowOrderStatusList(!showOrderStatusList)} className="cursor-pointer">
                {showOrderStatusList ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
              </button> */}
            </div>
            <OrderStatusSelector 
                selectedOrderStatus={selectedOrderStatus} 
                setSelectedOrderStatus={setSelectedOrderStatus}     
            />
            <OrderByStatusList 
                status={selectedOrderStatus}
            />

          </div>
        </motion.div>
    </>
  )
}

export default OrderByStatusMain