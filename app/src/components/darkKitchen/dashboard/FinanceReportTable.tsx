import { motion } from 'framer-motion'
import type { FinanceReportRow } from '../../../services/kitchen/financeService'
import { sortFinanceRowsAsc } from '../../../utils/financeHelpers'
import { formatDate, formatDecimal } from '../../../utils/inventoryHelpers'

interface Props {
    rows: FinanceReportRow[]
}

const FinanceReportTable = ({ rows }: Props) => {
    const sorted = sortFinanceRowsAsc(rows)

    if (sorted.length === 0) {
        return (
            <div className="text-center text-gray-500 py-12 bg-white rounded-lg border border-gray-200">
                No hay movimientos para el período seleccionado
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
        >
            <div className="p-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Detalle diario</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="text-left px-4 py-3 font-medium">Fecha</th>
                            <th className="text-right px-4 py-3 font-medium">Apertura</th>
                            <th className="text-right px-4 py-3 font-medium">Ingresos</th>
                            <th className="text-right px-4 py-3 font-medium">Gastos</th>
                            <th className="text-right px-4 py-3 font-medium">Cierre</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sorted.map(row => (
                            <tr key={row.date} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-700">{formatDate(row.date)}</td>
                                <td className="px-4 py-3 text-right text-gray-700">
                                    S/ {formatDecimal(row.opening_balance)}
                                </td>
                                <td className="px-4 py-3 text-right text-emerald-600 font-medium">
                                    +S/ {formatDecimal(row.income)}
                                </td>
                                <td className="px-4 py-3 text-right text-red-600 font-medium">
                                    -S/ {formatDecimal(row.expenses)}
                                </td>
                                <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                    S/ {formatDecimal(row.closing_balance)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    )
}

export default FinanceReportTable
