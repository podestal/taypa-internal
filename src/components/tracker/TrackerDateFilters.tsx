import { AnimatePresence, motion } from "framer-motion"
import { Calendar } from "lucide-react"
import { useState } from "react"

interface Props {
    dateFilter: DateFilter
    setDateFilter: (dateFilter: DateFilter) => void
    startDate: string
    setStartDate: (startDate: string) => void
    endDate: string
    setEndDate: (endDate: string) => void
}

type DateFilter = 'today' | 'last7days' | 'thisWeek' | 'thisMonth' | 'custom' | 'all'

const dateFilterButtons = [
    { id: 'today' as DateFilter, label: 'Hoy' },
    { id: 'last7days' as DateFilter, label: 'Últimos 7 días' },
    { id: 'thisWeek' as DateFilter, label: 'Esta Semana' },
    { id: 'thisMonth' as DateFilter, label: 'Este Mes' },
]

const TrackerDateFilters = ({
    dateFilter,
    setDateFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
}: Props) => {

    const [showDatePicker, setShowDatePicker] = useState(false)
  return (
    <div className="mb-6">
    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
      <Calendar className="w-4 h-4" />
      Filtrar por Fecha
    </h3>
    <div className="flex flex-wrap gap-2">
      {dateFilterButtons.map((filter) => (
        <motion.button
          key={filter.id}
          onClick={() => {
            setDateFilter(filter.id)
            setShowDatePicker(false)
          }}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer ${
            dateFilter === filter.id
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {filter.label}
        </motion.button>
      ))}
      
      {/* Custom Date Range Button */}
      <motion.button
        onClick={() => {
          setDateFilter('custom')
          setShowDatePicker(!showDatePicker)
        }}
        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
          dateFilter === 'custom'
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Calendar className="w-4 h-4" />
        Rango Personalizado
      </motion.button>
    </div>

    {/* Custom Date Range Picker */}
    <AnimatePresence>
      {showDatePicker && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Fin
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <motion.button
          onClick={() => {
            if (startDate && endDate) {
              setShowDatePicker(false)
            }
          }}
          disabled={!startDate || !endDate}
          className={`mt-4 px-4 py-2 rounded-lg font-medium transition-colors ${
            startDate && endDate
              ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          whileHover={startDate && endDate ? { scale: 1.05 } : {}}
          whileTap={startDate && endDate ? { scale: 0.95 } : {}}
        >
          Aplicar Rango
        </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
  )
}

export default TrackerDateFilters