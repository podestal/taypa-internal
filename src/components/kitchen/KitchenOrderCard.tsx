import { motion } from "framer-motion"
import { type OrderInKitchen } from "../../services/api/orderService"
import { useEffect, useState } from "react"
import KitchenOrderTimer from "./KitchenOrderTimer"
import KitchenOrderItemCard from "./KitchenOrderItemCard"

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

    const getTimeElapsed = (orderTime: Date) => {
        const orderDate = new Date(orderTime)
        const elapsed = Math.floor((currentTime.getTime() - orderDate.getTime()) / 1000) // seconds
        return elapsed
      }

    const getTimeColor = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        if (minutes < 5) return 'text-green-600 bg-green-100'
        if (minutes < 10) return 'text-yellow-600 bg-yellow-100'
        return 'text-red-600 bg-red-100'
      }

  return (
    <motion.div
    key={order.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ delay: index * 0.1 }}
    className={`rounded-xl shadow-lg p-6 border-l-4 ${getTimeColor(getTimeElapsed(order.updated_at))}`}
  >
    <KitchenOrderTimer 
        orderNumber={order.order_number.split('-')[1]} 
        timeElapsed={getTimeElapsed(order.updated_at)} 
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