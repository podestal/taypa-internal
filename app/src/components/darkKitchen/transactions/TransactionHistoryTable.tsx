import { motion } from 'framer-motion'
import { Loader2, Pencil } from 'lucide-react'
import type { KitchenAccount } from '../../../services/kitchen/accountService'
import type { KitchenCategory } from '../../../services/kitchen/categoryService'
import type { KitchenTransaction } from '../../../services/kitchen/transactionService'
import { formatDate, formatDecimal } from '../../../utils/inventoryHelpers'
import { sortTransactionsDesc, TRANSACTION_TYPE_LABELS } from '../../../utils/transactionHelpers'

interface Props {
    transactions: KitchenTransaction[]
    categories: KitchenCategory[]
    accounts: KitchenAccount[]
    isLoading: boolean
    error?: Error | null
    onEdit?: (transaction: KitchenTransaction) => void
}

const TransactionHistoryTable = ({
    transactions,
    categories,
    accounts,
    isLoading,
    error,
    onEdit,
}: Props) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16 bg-white rounded-lg border border-gray-200">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-12 bg-white rounded-lg border border-gray-200">
                Error al cargar transacciones: {error.message}
            </div>
        )
    }

    const sorted = sortTransactionsDesc(transactions)

    if (sorted.length === 0) {
        return (
            <div className="text-center text-gray-500 py-12 bg-white rounded-lg border border-gray-200">
                <p>No hay transacciones para los filtros seleccionados</p>
            </div>
        )
    }

    const getCategoryName = (transaction: KitchenTransaction) => {
        if (!transaction.category) return '—'
        return transaction.category_name
            ?? categories.find(c => c.id === transaction.category)?.name
            ?? `Categoría #${transaction.category}`
    }

    const getAccountName = (transaction: KitchenTransaction) =>
        transaction.account_name
        ?? accounts.find(a => a.id === transaction.account)?.name
        ?? `Cuenta #${transaction.account}`

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
                            <th className="text-left px-4 py-3 font-medium">Tipo</th>
                            <th className="text-left px-4 py-3 font-medium">Cuenta</th>
                            <th className="text-left px-4 py-3 font-medium">Categoría</th>
                            <th className="text-left px-4 py-3 font-medium">Descripción</th>
                            <th className="text-right px-4 py-3 font-medium">Monto</th>
                            {onEdit && <th className="text-right px-4 py-3 font-medium">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sorted.map(transaction => (
                            <tr key={transaction.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                                    {formatDate(transaction.transaction_date)}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                        transaction.transaction_type === 'I'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {TRANSACTION_TYPE_LABELS[transaction.transaction_type]}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-700">{getAccountName(transaction)}</td>
                                <td className="px-4 py-3 text-gray-700">{getCategoryName(transaction)}</td>
                                <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate" title={transaction.description}>
                                    {transaction.description || '—'}
                                </td>
                                <td className={`px-4 py-3 text-right font-semibold ${
                                    transaction.transaction_type === 'I' ? 'text-emerald-700' : 'text-red-700'
                                }`}>
                                    {transaction.transaction_type === 'I' ? '+' : '-'} S/ {formatDecimal(transaction.amount)}
                                </td>
                                {onEdit && (
                                    <td className="px-4 py-3 text-right">
                                        <motion.button
                                            type="button"
                                            onClick={() => onEdit(transaction)}
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                            Editar
                                        </motion.button>
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

export default TransactionHistoryTable
