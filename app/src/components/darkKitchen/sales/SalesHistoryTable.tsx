import { motion } from 'framer-motion'
import { Loader2, XCircle } from 'lucide-react'
import type { Sale } from '../../../services/kitchen/saleService'
import type { KitchenAccount } from '../../../services/kitchen/accountService'
import { sortSalesByDateDesc } from '../../../utils/saleHelpers'
import { formatDate, formatDecimal } from '../../../utils/inventoryHelpers'

interface Props {
    sales: Sale[]
    accounts: KitchenAccount[]
    isLoading: boolean
    error?: Error | null
    onCancel?: (sale: Sale) => void
    cancellingSaleId?: number | null
}

const SalesHistoryTable = ({
    sales,
    accounts,
    isLoading,
    error,
    onCancel,
    cancellingSaleId,
}: Props) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16 bg-white rounded-lg border border-gray-200">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-12 bg-white rounded-lg border border-gray-200">
                Error al cargar ventas: {error.message}
            </div>
        )
    }

    const sorted = sortSalesByDateDesc(sales)

    if (sorted.length === 0) {
        return (
            <div className="text-center text-gray-500 py-12 bg-white rounded-lg border border-gray-200">
                <p>No hay ventas para los filtros seleccionados</p>
            </div>
        )
    }

    const getAccountName = (sale: Sale) => {
        if (!sale.transaction) return '—'
        return accounts.find(a => a.id === sale.transaction?.account)?.name
            ?? `Cuenta #${sale.transaction.account}`
    }

    const formatToppings = (sale: Sale) => {
        if (sale.toppings.length === 0) return '—'
        return sale.toppings
            .map(line => {
                const name = line.topping_name ?? `#${line.topping}`
                return `${name} ×${formatDecimal(line.quantity)}`
            })
            .join(', ')
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
                            <th className="text-left px-4 py-3 font-medium">Plato</th>
                            <th className="text-left px-4 py-3 font-medium">Cuenta</th>
                            <th className="text-right px-4 py-3 font-medium">Cant.</th>
                            <th className="text-right px-4 py-3 font-medium">P. unit.</th>
                            <th className="text-right px-4 py-3 font-medium">Total</th>
                            <th className="text-left px-4 py-3 font-medium">Toppings</th>
                            <th className="text-left px-4 py-3 font-medium">Notas</th>
                            {onCancel && (
                                <th className="text-center px-4 py-3 font-medium">Acción</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sorted.map(sale => (
                            <tr key={sale.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                                    {formatDate(sale.sale_date ?? sale.created_at)}
                                </td>
                                <td className="px-4 py-3 font-medium text-gray-900">
                                    {sale.dish_name ?? `Plato #${sale.dish}`}
                                </td>
                                <td className="px-4 py-3 text-gray-700">{getAccountName(sale)}</td>
                                <td className="px-4 py-3 text-right text-gray-900">
                                    {formatDecimal(sale.quantity_sold)}
                                </td>
                                <td className="px-4 py-3 text-right text-gray-700">
                                    S/ {formatDecimal(sale.unit_price)}
                                </td>
                                <td className="px-4 py-3 text-right font-semibold text-emerald-700">
                                    S/ {formatDecimal(sale.subtotal)}
                                </td>
                                <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate" title={formatToppings(sale)}>
                                    {formatToppings(sale)}
                                </td>
                                <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate" title={sale.notes}>
                                    {sale.notes || '—'}
                                </td>
                                {onCancel && (
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            type="button"
                                            onClick={() => onCancel(sale)}
                                            disabled={cancellingSaleId === sale.id}
                                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {cancellingSaleId === sale.id ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                <XCircle className="w-3.5 h-3.5" />
                                            )}
                                            <span>{cancellingSaleId === sale.id ? '...' : 'Cancelar'}</span>
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    )
}

export default SalesHistoryTable
