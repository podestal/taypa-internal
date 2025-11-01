import type { CategoryOrderItem } from "../../services/api/orderService"

interface Props {
    categoryName: string
    items: CategoryOrderItem[]
}

const KitchenOrderItemCard = ({ categoryName, items }: Props) => {
  return (
    <div key={categoryName} className="bg-gray-50 rounded-lg p-3">
        <h4 className="font-semibold text-gray-900 mb-2">{categoryName}</h4>
        <div className="space-y-2">
        {/* {items.map((item) => (
            <div key={item.id} className="pl-2 border-l-2 border-blue-300">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                <div className="font-medium text-gray-900">{item.dish}</div>
                {item.observation && (
                    <div className="text-sm text-orange-600 italic mt-1">
                    ⚠️ {item.observation}
                    </div>
                )}
                </div>
                <div className="text-right">
                <div className="text-lg font-bold text-blue-600">x{item.quantity}</div>
                </div>
            </div>
            </div>
        ))} */}
        </div>
    </div>
  )
}

export default KitchenOrderItemCard