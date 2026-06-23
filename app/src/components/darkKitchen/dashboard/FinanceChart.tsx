import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import type { FinanceReportRow } from '../../../services/kitchen/financeService'
import { financeChartData } from '../../../utils/financeHelpers'
import { formatDate, formatDecimal } from '../../../utils/inventoryHelpers'

interface Props {
    rows: FinanceReportRow[]
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2,
    }).format(value)

const FinanceChart = ({ rows }: Props) => {
    const chartData = useMemo(() => financeChartData(rows), [rows])

    if (chartData.length === 0) {
        return null
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-5"
        >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ingresos vs gastos</h2>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(value) => formatDate(String(value))}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            tickFormatter={(value) => `S/ ${formatDecimal(value)}`}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            labelFormatter={(label) => formatDate(String(label))}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="income"
                            name="Ingresos"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="expenses"
                            name="Gastos"
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="closing"
                            name="Saldo"
                            stroke="#6366f1"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    )
}

export default FinanceChart
