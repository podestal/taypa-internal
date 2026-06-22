import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import type { Purchase } from '../../../services/kitchen/purchaseService'
import type { Product } from '../../../services/kitchen/productService'
import type { KitchenAccount } from '../../../services/kitchen/accountService'
import { formatDate, formatDecimal } from '../../../utils/inventoryHelpers'
import { purchaseTotal } from '../../../utils/purchaseHelpers'

interface Props {
    purchase: Purchase
    products: Product[]
    accounts: KitchenAccount[]
    index: number
}

const PurchaseCard = ({ purchase, products, accounts, index }: Props) => {
    const productName =
        purchase.product_name ??
        products.find(p => p.id === purchase.product)?.name ??
        `Producto #${purchase.product}`

    const accountName =
        purchase.account_name ??
        accounts.find(a => a.id === purchase.account)?.name ??
        (purchase.account ? `Cuenta #${purchase.account}` : '—')

    const total = purchaseTotal(purchase.quantity_bought, purchase.unit_price)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow"
        >
            <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-violet-50 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{productName}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{accountName} · {formatDate(purchase.created_at)}</p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-violet-700">S/ {formatDecimal(total)}</p>
                    <p className="text-xs text-gray-500">total</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Cantidad</p>
                    <p className="font-semibold text-gray-900">{formatDecimal(purchase.quantity_bought)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Precio unitario</p>
                    <p className="font-semibold text-gray-900">S/ {formatDecimal(purchase.unit_price)}</p>
                </div>
            </div>

            {purchase.notes && (
                <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100">{purchase.notes}</p>
            )}
        </motion.div>
    )
}

export default PurchaseCard
