import { motion } from 'framer-motion'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import type { InventoryMovement } from '../../../services/kitchen/inventoryService'
import type { Product } from '../../../services/kitchen/productService'
import {
    formatDate,
    formatDecimal,
    MOVEMENT_SOURCE_LABELS,
    MOVEMENT_TYPE_LABELS,
} from '../../../utils/inventoryHelpers'

interface Props {
    movement: InventoryMovement
    products: Product[]
    index: number
}

const MovementCard = ({ movement, products, index }: Props) => {
    const productName =
        movement.product_name ??
        products.find(p => p.id === movement.product)?.name ??
        `Producto #${movement.product}`

    const isIn = movement.movement_type === 'IN'

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4"
        >
            <div className={`p-2 rounded-lg ${isIn ? 'bg-emerald-50' : 'bg-orange-50'}`}>
                {isIn ? (
                    <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                ) : (
                    <ArrowUpRight className="w-5 h-5 text-orange-600" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{productName}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        isIn ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                        {MOVEMENT_TYPE_LABELS[movement.movement_type]}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-700">
                        {MOVEMENT_SOURCE_LABELS[movement.source]}
                    </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                    {formatDate(movement.movement_date)}
                    {movement.notes && ` · ${movement.notes}`}
                </p>
            </div>

            <div className="text-right shrink-0">
                <p className={`text-lg font-bold ${isIn ? 'text-emerald-600' : 'text-orange-600'}`}>
                    {isIn ? '+' : '-'}{formatDecimal(movement.quantity)}
                </p>
            </div>
        </motion.div>
    )
}

export default MovementCard
