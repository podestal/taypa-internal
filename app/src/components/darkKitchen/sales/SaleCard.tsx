import { motion } from 'framer-motion'
import { Receipt, XCircle } from 'lucide-react'
import type { Sale } from '../../../services/kitchen/saleService'
import type { KitchenAccount } from '../../../services/kitchen/accountService'
import { formatDate, formatDecimal } from '../../../utils/inventoryHelpers'

interface Props {
    sale: Sale
    accounts: KitchenAccount[]
    index: number
    onCancel?: (sale: Sale) => void
    isCancelling?: boolean
}

const SaleCard = ({ sale, accounts, index, onCancel, isCancelling }: Props) => {
    const accountName = sale.transaction
        ? accounts.find(a => a.id === sale.transaction?.account)?.name
            ?? `Cuenta #${sale.transaction.account}`
        : '—'

    const dishName = sale.dish_name ?? `Plato #${sale.dish}`

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow"
        >
            <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg">
                    <Receipt className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{dishName}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {accountName}
                        {sale.created_at && ` · ${formatDate(sale.created_at)}`}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-emerald-700">S/ {formatDecimal(sale.subtotal)}</p>
                    <p className="text-xs text-gray-500">ingreso</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Cantidad</p>
                    <p className="font-semibold text-gray-900">{formatDecimal(sale.quantity_sold)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Precio unitario</p>
                    <p className="font-semibold text-gray-900">S/ {formatDecimal(sale.unit_price)}</p>
                </div>
            </div>

            {sale.toppings.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                    <p className="text-xs font-medium text-gray-500">Toppings</p>
                    {sale.toppings.map((line, i) => (
                        <p key={line.id ?? i} className="text-sm text-gray-600">
                            {line.topping_name ?? `Topping #${line.topping}`}
                            {' × '}{formatDecimal(line.quantity)}
                            {line.subtotal != null && (
                                <span className="text-gray-400"> — S/ {formatDecimal(line.subtotal)}</span>
                            )}
                        </p>
                    ))}
                </div>
            )}

            {sale.notes && (
                <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100">{sale.notes}</p>
            )}

            {onCancel && (
                <motion.button
                    onClick={() => onCancel(sale)}
                    disabled={isCancelling}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <XCircle className="w-4 h-4" />
                    <span>{isCancelling ? 'Cancelando...' : 'Cancelar venta'}</span>
                </motion.button>
            )}
        </motion.div>
    )
}

export default SaleCard
