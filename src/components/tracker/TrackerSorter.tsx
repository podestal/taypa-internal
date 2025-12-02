import { motion } from 'framer-motion'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

type SortBy = 'date' | 'amount' | null

interface Props {
    sortBy: SortBy
    setSortBy: (sortBy: SortBy) => void
    sortOrder: 'asc' | 'desc'
    setSortOrder: (sortOrder: 'asc' | 'desc') => void
}

const TrackerSorter = ({ sortBy, setSortBy, sortOrder, setSortOrder }: Props) => {
    const handleSort = (newSortBy: 'date' | 'amount') => {
        // If clicking the same sort, toggle order. Otherwise, set new sort.
        if (sortBy === newSortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(newSortBy)
            setSortOrder('desc') // Default to descending
        }
    }
    
    const handleClearSort = () => {
        setSortBy(null)
    }
  return (
<div>
    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4" />
        Ordenar por
    </h3>
    <div className="flex flex-wrap gap-2">
        {[
        { id: 'date' as const, label: 'Fecha' },
        { id: 'amount' as const, label: 'Monto' },
        ].map((option) => {
        const isActive = sortBy === option.id
        return (
            <motion.button
            key={option.id}
            onClick={() => handleSort(option.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            >
            {option.label}
            {isActive && (
                sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
            )}
            </motion.button>
        )
        })}
        {sortBy && (
            <motion.button
            onClick={handleClearSort}
            className="px-4 py-2 rounded-lg font-medium text-sm transition-all bg-gray-200 text-gray-700 hover:bg-gray-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            >
            Limpiar
            </motion.button>
        )}
    </div>
    </div>
  )
}

export default TrackerSorter