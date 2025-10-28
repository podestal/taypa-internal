import { motion } from "framer-motion"
import type { Dish } from "../../services/api/dishService"
import useCreateOrderItem from "../../hooks/api/orderItem/useCreateOrderItem"
import OrderItemForm from "./OrderItemForm"

interface Props {
  orderId: number
  dish: Dish
}

const CreateOrderItem = ({ orderId, dish }: Props) => {

    console.log('dish', dish);
    console.log('orderId', orderId);

    const createOrderItem = useCreateOrderItem()
  
  return (
    <OrderItemForm createOrderItem={createOrderItem} orderId={orderId} dish={dish} />
  )
}

export default CreateOrderItem