import { motion } from "framer-motion"
import { CheckCircle, ChefHat, Package, Truck } from "lucide-react"
import { useState } from "react"


const orderStatusTabs = [
    { id: 'IK' as const, label: 'En Cocina', icon: <ChefHat className="w-4 h-4" />, color: 'orange' },
    { id: 'PA' as const, label: 'Preparadas', icon: <Package className="w-4 h-4" />, color: 'blue' },
    { id: 'IT' as const, label: 'En Tránsito', icon: <Truck className="w-4 h-4" />, color: 'purple' },
    { id: 'DO' as const, label: 'Entregadas', icon: <CheckCircle className="w-4 h-4" />, color: 'green' }
  ]

const OrderStatusSelector = () => {

    const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>('IK')
  return (
    <div className="flex flex-wrap gap-2 mb-6">
        {orderStatusTabs.map((tab) => {
        const isActive = selectedOrderStatus === tab.id
        const colorClasses = {
            orange: isActive ? 'bg-orange-600 text-white border-orange-600' : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
            blue: isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
            purple: isActive ? 'bg-purple-600 text-white border-purple-600' : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
            green: isActive ? 'bg-green-600 text-white border-green-600' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
        }
        
        return (
            <motion.button
                key={tab.id}
                onClick={() => setSelectedOrderStatus(tab.id)}
                className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                    colorClasses[tab.color as keyof typeof colorClasses]
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {tab.icon}
                <span>{tab.label}</span>
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    isActive ? 'bg-white/20' : 'bg-white/60'
                }`}>
                    {/* {orders.filter(order => order.status === tab.id).length} */}
                </span>
            </motion.button>
        )
        })}
    </div>
  )
}

export default OrderStatusSelector