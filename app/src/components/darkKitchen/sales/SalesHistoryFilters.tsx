import { motion } from 'framer-motion'
import { Calendar, Filter } from 'lucide-react'
import type { KitchenDish } from '../../../services/kitchen/dishService'
import type { KitchenCategory } from '../../../services/kitchen/categoryService'
import {
    SALE_HISTORY_DATE_PRESETS,
    type SaleHistoryDatePreset,
    type SaleHistoryFilters,
} from '../../../utils/saleHelpers'

interface Props {
    filters: SaleHistoryFilters
    dishes: KitchenDish[]
    categories: KitchenCategory[]
    onFiltersChange: (filters: SaleHistoryFilters) => void
    onDatePresetChange: (preset: SaleHistoryDatePreset) => void
}

const SalesHistoryFilters = ({
    filters,
    dishes,
    categories,
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
                <Filter className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-semibold text-gray-900">Filtros del historial</h3>
            </div>

            <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Período
                </p>
                <div className="flex flex-wrap gap-2">
                    {SALE_HISTORY_DATE_PRESETS.map(preset => (
                        <motion.button
                            key={preset.id}
                            onClick={() => onDatePresetChange(preset.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                filters.datePreset === preset.id
                                    ? 'bg-emerald-600 text-white'
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
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Hasta</label>
                    <input
                        type="date"
                        value={filters.end_date}
                        onChange={(e) => handleDateFieldChange('end_date', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Plato</label>
                    <select
                        value={filters.dish_id}
                        onChange={(e) => onFiltersChange({ ...filters, dish_id: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="">Todos los platos</option>
                        {dishes.map(dish => (
                            <option key={dish.id} value={String(dish.id)}>{dish.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Categoría</label>
                    <select
                        value={filters.category_id}
                        onChange={(e) => onFiltersChange({ ...filters, category_id: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map(category => (
                            <option key={category.id} value={String(category.id)}>{category.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </motion.div>
    )
}

export default SalesHistoryFilters
