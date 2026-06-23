import { motion } from 'framer-motion'
import { Calendar, Wallet } from 'lucide-react'
import type { KitchenAccount } from '../../../services/kitchen/accountService'
import { formatDecimal } from '../../../utils/inventoryHelpers'
import type { FinanceReportParams } from '../../../services/kitchen/financeService'
import {
    FINANCE_DATE_PRESETS,
    getFinanceDateRange,
    type FinanceDatePreset,
} from '../../../utils/financeHelpers'

interface Props {
    params: FinanceReportParams
    accounts: KitchenAccount[]
    datePreset: FinanceDatePreset
    onParamsChange: (params: FinanceReportParams) => void
    onDatePresetChange: (preset: FinanceDatePreset) => void
}

const FinanceFilters = ({
    params,
    accounts,
    datePreset,
    onParamsChange,
    onDatePresetChange,
}: Props) => {
    const selectedAccount = accounts.find(a => a.id === Number(params.account_id))

    const handlePresetClick = (preset: FinanceDatePreset) => {
        onDatePresetChange(preset)
        const range = getFinanceDateRange(preset)
        onParamsChange({ ...params, ...range })
    }

    const handleDateChange = (field: 'start_date' | 'end_date', value: string) => {
        onDatePresetChange('custom')
        onParamsChange({ ...params, [field]: value })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-5"
        >
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
            </div>

            <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Período rápido</p>
                <div className="flex flex-wrap gap-2">
                    {FINANCE_DATE_PRESETS.map(preset => (
                        <motion.button
                            key={preset.id}
                            onClick={() => handlePresetClick(preset.id)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                datePreset === preset.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {preset.label}
                        </motion.button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Desde</label>
                    <input
                        type="date"
                        value={params.start_date}
                        onChange={(e) => handleDateChange('start_date', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Hasta</label>
                    <input
                        type="date"
                        value={params.end_date}
                        onChange={(e) => handleDateChange('end_date', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        <span className="inline-flex items-center gap-1">
                            <Wallet className="w-3.5 h-3.5" />
                            Cuenta
                        </span>
                    </label>
                    <select
                        value={params.account_id}
                        onChange={(e) => onParamsChange({ ...params, account_id: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                        {accounts.length === 0 && (
                            <option value="">Sin cuentas disponibles</option>
                        )}
                        {accounts.map(account => (
                            <option key={account.id} value={String(account.id)}>
                                {account.name} (S/ {formatDecimal(account.balance)})
                            </option>
                        ))}
                    </select>
                    {selectedAccount && (
                        <p className="text-xs text-gray-500 mt-1">
                            Saldo actual: S/ {formatDecimal(selectedAccount.balance)}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default FinanceFilters
