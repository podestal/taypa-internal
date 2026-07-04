import { motion } from 'framer-motion'
import { Loader2, Pencil } from 'lucide-react'
import type { Purchase } from '../../../services/kitchen/purchaseService'
import type { Product } from '../../../services/kitchen/productService'
import type { KitchenAccount } from '../../../services/kitchen/accountService'
import { getPurchaseTotal, sortPurchasesByDateDesc } from '../../../utils/purchaseHelpers'
import { formatDate, formatDecimal } from '../../../utils/inventoryHelpers'

interface Props {
    purchases: Purchase[]
    products: Product[]
    accounts: KitchenAccount[]
    isLoading: boolean
    error?: Error | null
    onEdit?: (purchase: Purchase) => void
}

const PurchasesHistoryTable = ({
    purchases,
    products,
    accounts,
    isLoading,
    error,
    onEdit,
}: Props) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16 bg-white rounded-lg border border-gray-200">
                <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-12 bg-white rounded-lg border border-gray-200">
                Error al cargar compras: {error.message}
            </div>
        )
    }

    const sorted = sortPurchasesByDateDesc(purchases)

    if (sorted.length === 0) {
        return (
            <div className="text-center text-gray-500 py-12 bg-white rounded-lg border border-gray-200">
                <p>No hay compras para los filtros seleccionados</p>
            </div>
        )
    }

    const getProductName = (purchase: Purchase) =>
        purchase.product_name ?? products.find(p => p.id === purchase.product)?.name ?? `Producto #${purchase.product}`

    const getAccountName = (purchase: Purchase) => {
        const accountId = purchase.account || purchase.transaction?.account
        if (!accountId) return '—'
        return purchase.account_name
            ?? purchase.transaction?.account_name
            ?? accounts.find(a => a.id === accountId)?.name
            ?? `Cuenta #${accountId}`
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
        >
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="text-left px-4 py-3 font-medium">Fecha</th>
                            <th className="text-left px-4 py-3 font-medium">Producto</th>
                            <th className="text-left px-4 py-3 font-medium">Cuenta</th>
                            <th className="text-right px-4 py-3 font-medium">Cant.</th>
                            <th className="text-right px-4 py-3 font-medium">P. unit.</th>
                            <th className="text-right px-4 py-3 font-medium">Total</th>
                            <th className="text-left px-4 py-3 font-medium">Notas</th>
                            {onEdit && <th className="text-right px-4 py-3 font-medium">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sorted.map(purchase => {
                            const total = getPurchaseTotal(purchase)
                            return (
                                <tr key={purchase.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                                        {formatDate(purchase.purchase_date ?? purchase.created_at)}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {getProductName(purchase)}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{getAccountName(purchase)}</td>
                                    <td className="px-4 py-3 text-right text-gray-900">
                                        {formatDecimal(purchase.quantity_bought)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-700">
                                        S/ {formatDecimal(purchase.unit_price)}
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-violet-700">
                                        S/ {formatDecimal(total)}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate" title={purchase.notes}>
                                        {purchase.notes || '—'}
                                    </td>
                                    {onEdit && (
                                        <td className="px-4 py-3 text-right">
                                            <motion.button
                                                type="button"
                                                onClick={() => onEdit(purchase)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-violet-700 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors"
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                                Editar
                                            </motion.button>
                                        </td>
                                    )}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </motion.div>
    )
}

export default PurchasesHistoryTable
