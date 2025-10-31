import { motion } from "framer-motion"
import { type OrderInKitchen } from "../../services/api/orderService"
import { useEffect, useState } from "react"
import KitchenOrderTimer from "./KitchenOrderTimer"
import KitchenOrderItemCard from "./KitchenOrderItemCard"
import getTimeElapsed from "../../utils/getTimeElapsed"
import getTimeColor from "../../utils/getTimeColor"

interface Props {
    order: OrderInKitchen
    index: number
}

const KitchenOrderCard = ({ order, index }: Props) => {

    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
          setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
      }, [])

  return (
    <motion.div
    key={order.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ delay: index * 0.1 }}
    className={`rounded-xl shadow-lg p-6 border-l-4 ${getTimeColor(getTimeElapsed(currentTime, order.updated_at))}`}
  >
    <KitchenOrderTimer 
        orderNumber={order.order_number.split('-')[1]} 
        timeElapsed={getTimeElapsed(currentTime, order.updated_at)} 
        updated_at={order.updated_at} 
        getTimeColor={getTimeColor} 
    />
    <div className="space-y-3">
      {Object.entries(order.categories).map(([categoryName, items]) => (
        <KitchenOrderItemCard 
            key={categoryName} 
            categoryName={categoryName} 
            items={items} 
        />
      ))}
    </div>

  </motion.div>
  )
}

export default KitchenOrderCard