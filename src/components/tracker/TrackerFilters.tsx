import { motion } from 'framer-motion'
import TrackerDateFilters from './TrackerDateFilters'
import TrackerTypeFilters from './TrackerTypeFilters'
import TrackerSorter from './TrackerSorter'

type DateFilter = 'today' | 'last7days' | 'thisWeek' | 'thisMonth' | 'year' | 'custom' | 'all'
type SortBy = 'date' | 'amount' | null
type SortOrder = 'asc' | 'desc'

interface Props {
  dateFilter: DateFilter
  setDateFilter: (dateFilter: DateFilter) => void
  selectedYear: number
  setSelectedYear: (year: number) => void
  startDate: string
  setStartDate: (startDate: string) => void
  endDate: string
  setEndDate: (endDate: string) => void
  typeFilter: 'all' | 'I' | 'E'
  setTypeFilter: (typeFilter: 'all' | 'I' | 'E') => void
  sortBy: SortBy
  setSortBy: (sortBy: SortBy) => void
  sortOrder: SortOrder
  setSortOrder: (sortOrder: SortOrder) => void
}

const TrackerFilters = ({
  dateFilter,
  setDateFilter,
  selectedYear,
  setSelectedYear,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  typeFilter,
  setTypeFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6"
    >
      {/* Date Filter Buttons */}
      <TrackerDateFilters
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
      
      {/* Type Filter */}
      <TrackerTypeFilters
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {/* Sorting Options */}
      <TrackerSorter
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
    </motion.div>
  )
}

export default TrackerFilters

