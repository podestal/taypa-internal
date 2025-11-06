import { motion } from 'framer-motion'
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react'

interface Props {
    typeFilter: TypeFilter
    setTypeFilter: (typeFilter: TypeFilter) => void
}

type TypeFilter = 'all' | 'I' | 'E'

const typeFilterButtons = [
    { id: 'all' as TypeFilter, label: 'Todos', icon: <ArrowUpDown className="w-4 h-4" />, color: 'gray' },
    { id: 'I' as TypeFilter, label: 'Ingresos', icon: <TrendingUp className="w-4 h-4" />, color: 'green' },
    { id: 'E' as TypeFilter, label: 'Gastos', icon: <TrendingDown className="w-4 h-4" />, color: 'red' }
]

const TrackerTypeFilters = ({ typeFilter, setTypeFilter }: Props) => {
  return (
    <div className="mb-6">
    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
      Filtrar por Tipo
    </h3>
    <div className="flex flex-wrap gap-2">
      {typeFilterButtons.map((filter) => {
        const isActive = typeFilter === filter.id
        const colorClasses = {
          gray: isActive ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200',
          green: isActive ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100',
          red: isActive ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
        }
        return (
          <motion.button
            key={filter.id}
            onClick={() => setTypeFilter(filter.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 cursor-pointer ${
              colorClasses[filter.color as keyof typeof colorClasses]
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {filter.icon}
            <span>{filter.label}</span>
          </motion.button>
        )
      })}
    </div>
  </div>
  )
}

export default TrackerTypeFilters