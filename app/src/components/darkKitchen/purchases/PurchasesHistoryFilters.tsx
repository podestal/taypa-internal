import { motion } from 'framer-motion'
import { Calendar, Filter } from 'lucide-react'
import type { Product } from '../../../services/kitchen/productService'
import type { KitchenAccount } from '../../../services/kitchen/accountService'
import {
    PURCHASE_HISTORY_DATE_PRESETS,
    type PurchaseHistoryDatePreset,
    type PurchaseHistoryFilters,
} from '../../../utils/purchaseHelpers'

interface Props {
    filters: PurchaseHistoryFilters
    products: Product[]
    accounts: KitchenAccount[]
    onFiltersChange: (filters: PurchaseHistoryFilters) => void
    onDatePresetChange: (preset: PurchaseHistoryDatePreset) => void
}

const PurchasesHistoryFilters = ({
    filters,
    products,
    accounts,
    onFiltersChange,
    onDatePresetChange,
}: Props) => {
    const handleDateFieldChange = (field: 'start_date' | 'end_date', value: string) => {
        onFiltersChange({
            ...filters,
            datePreset: 'custom',
            [field]: value,
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-5"
        >
            <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-violet-600" />
                <h3 className="text-sm font-semibold text-gray-900">Filtros del historial</h3>
            </div>

            <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Período
                </p>
                <div className="flex flex-wrap gap-2">
                    {PURCHASE_HISTORY_DATE_PRESETS.map(preset => (
                        <motion.button
                            key={preset.id}
                            onClick={() => onDatePresetChange(preset.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                filters.datePreset === preset.id
                                    ? 'bg-violet-600 text-white'
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
                        value={filters.start_date}
                        onChange={(e) => handleDateFieldChange('start_date', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Hasta</label>
                    <input
                        type="date"
                        value={filters.end_date}
                        onChange={(e) => handleDateFieldChange('end_date', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Producto</label>
                    <select
                        value={filters.product_id}
                        onChange={(e) => onFiltersChange({ ...filters, product_id: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                    >
                        <option value="">Todos los productos</option>
                        {products.map(product => (
                            <option key={product.id} value={String(product.id)}>{product.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Cuenta</label>
                    <select
                        value={filters.account_id}
                        onChange={(e) => onFiltersChange({ ...filters, account_id: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                    >
                        <option value="">Todas las cuentas</option>
                        {accounts.map(account => (
                            <option key={account.id} value={String(account.id)}>{account.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </motion.div>
    )
}

export default PurchasesHistoryFilters
