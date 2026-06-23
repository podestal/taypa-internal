import { motion } from 'framer-motion'
import { ArrowDownCircle, ArrowUpCircle, Scale, Wallet } from 'lucide-react'
import { formatDecimal } from '../../../utils/inventoryHelpers'

interface Props {
    income: number
    expenses: number
    net: number
    opening: number
    closing: number
}

const cards = [
    { key: 'income', label: 'Ingresos', icon: ArrowUpCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { key: 'expenses', label: 'Gastos', icon: ArrowDownCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { key: 'net', label: 'Neto', icon: Scale, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { key: 'closing', label: 'Saldo final', icon: Wallet, color: 'text-violet-600', bg: 'bg-violet-50' },
] as const

const FinanceSummaryCards = ({ income, expenses, net, opening, closing }: Props) => {
    const values = { income, expenses, net, closing }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {cards.map((card, index) => {
                const Icon = card.icon
                const value = values[card.key]
                const isNet = card.key === 'net'

                return (
                    <motion.div
                        key={card.key}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-lg shadow-md border border-gray-200 p-5"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    {card.label}
                                </p>
                                <p className={`text-2xl font-bold mt-2 ${
                                    isNet
                                        ? value >= 0 ? 'text-emerald-700' : 'text-red-700'
                                        : 'text-gray-900'
                                }`}>
                                    S/ {formatDecimal(value)}
                                </p>
                                {card.key === 'closing' && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Apertura: S/ {formatDecimal(opening)}
                                    </p>
                                )}
                            </div>
                            <div className={`p-2 rounded-lg ${card.bg}`}>
                                <Icon className={`w-5 h-5 ${card.color}`} />
                            </div>
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}

export default FinanceSummaryCards
