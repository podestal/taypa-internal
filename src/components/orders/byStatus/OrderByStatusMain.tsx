import { useState } from "react"
import OrderStatusSelector from "./OrderStatusSelector"
import OrderByStatusList from "./OrderByStatusList"

const OrderByStatusMain = () => {

    const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>('IK')

  return (
    <>
        <>{console.log('selectedOrderStatus',selectedOrderStatus)}</>
        <OrderStatusSelector 
            selectedOrderStatus={selectedOrderStatus} 
            setSelectedOrderStatus={setSelectedOrderStatus}     
        />
        <OrderByStatusList />
    </>
  )
}

export default OrderByStatusMain