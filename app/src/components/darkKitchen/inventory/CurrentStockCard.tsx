import { motion } from 'framer-motion'
import { Package } from 'lucide-react'
import type { CurrentStockItem } from '../../../services/kitchen/inventoryService'
import { formatDecimal } from '../../../utils/inventoryHelpers'

interface Props {
    item: CurrentStockItem
    index: number
}

const CurrentStockCard = ({ item, index }: Props) => {
    const isLow = item.quantity <= 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isLow ? 'bg-red-50' : 'bg-emerald-50'}`}>
                    <Package className={`w-5 h-5 ${isLow ? 'text-red-600' : 'text-emerald-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{item.product_name}</h3>
                    <p className="text-xs text-gray-500">Stock actual</p>
                </div>
                <div className="text-right">
                    <p className={`text-xl font-bold ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatDecimal(item.quantity)}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

export default CurrentStockCard
