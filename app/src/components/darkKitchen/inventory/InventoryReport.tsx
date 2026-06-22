import { motion } from 'framer-motion'
import { Calendar, Loader2 } from 'lucide-react'
import type { InventoryReportItem, InventoryReportParams } from '../../../services/kitchen/inventoryService'
import type { Product } from '../../../services/kitchen/productService'
import { formatDate, formatDecimal } from '../../../utils/inventoryHelpers'

interface Props {
    report: InventoryReportItem[]
    products: Product[]
    params: InventoryReportParams
    isLoading: boolean
    error?: Error | null
    onParamsChange: (params: InventoryReportParams) => void
}

const InventoryReport = ({
    report,
    products,
    params,
    isLoading,
    error,
    onParamsChange,
}: Props) => {
    const safeReport = Array.isArray(report) ? report : []
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
        >
            <div className="p-5 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Reporte de inventario</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Desde</label>
                        <input
                            type="date"
                            value={params.start_date ?? ''}
                            onChange={(e) => onParamsChange({ ...params, start_date: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Hasta</label>
                        <input
                            type="date"
                            value={params.end_date ?? ''}
                            onChange={(e) => onParamsChange({ ...params, end_date: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Producto</label>
                        <select
                            value={params.product_id ?? ''}
                            onChange={(e) => onParamsChange({
                                ...params,
                                product_id: e.target.value || undefined,
                            })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos los productos</option>
                            {products.map(product => (
                                <option key={product.id} value={String(product.id)}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
            ) : error ? (
                <div className="text-center text-red-500 py-12 px-4">
                    Error al cargar el reporte: {error.message}
                </div>
            ) : safeReport.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                    No hay datos para el período seleccionado
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="text-left px-4 py-3 font-medium">Fecha</th>
                                <th className="text-left px-4 py-3 font-medium">Producto</th>
                                <th className="text-right px-4 py-3 font-medium">Entradas</th>
                                <th className="text-right px-4 py-3 font-medium">Salidas</th>
                                <th className="text-right px-4 py-3 font-medium">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {safeReport.map((row, index) => (
                                <tr key={`${row.product_id}-${row.date}-${index}`} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-700">{formatDate(row.date)}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{row.product_name}</td>
                                    <td className="px-4 py-3 text-right text-emerald-600 font-medium">
                                        +{formatDecimal(row.in)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-orange-600 font-medium">
                                        -{formatDecimal(row.out)}
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                        {formatDecimal(row.balance)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    )
}

export default InventoryReport
