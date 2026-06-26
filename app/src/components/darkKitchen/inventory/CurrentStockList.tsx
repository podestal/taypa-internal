import type { CurrentStockItem } from '../../../services/kitchen/inventoryService'
import CurrentStockCard from './CurrentStockCard'

interface Props {
    items: CurrentStockItem[]
    emptyMessage?: string
}

const CurrentStockList = ({ items, emptyMessage = 'No hay productos en inventario' }: Props) => {
    if (items.length === 0) {
        return (
            <div className="text-center text-gray-500 py-10 bg-white rounded-lg border border-gray-200">
                <p>{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {items.map((item, index) => (
                <CurrentStockCard key={item.product_id} item={item} index={index} />
            ))}
        </div>
    )
}

export default CurrentStockList
