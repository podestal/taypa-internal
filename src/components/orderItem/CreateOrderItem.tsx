import type { Dish } from "../../services/api/dishService"
import useCreateOrderItem from "../../hooks/api/orderItem/useCreateOrderItem"
import OrderItemForm from "./OrderItemForm"

interface Props {
  dish: Dish
}

const CreateOrderItem = ({ dish }: Props) => {

    const createOrderItem = useCreateOrderItem()
  
  return (
    <OrderItemForm createOrderItem={createOrderItem} dish={dish} />
  )
}

export default CreateOrderItem