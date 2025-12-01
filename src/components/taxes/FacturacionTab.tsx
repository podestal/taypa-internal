import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, List, BarChart3 } from 'lucide-react'
import SunatDocumentsList from './SunatDocumentsList'
import FacturacionCharts from './FacturacionCharts'
import useGetDocuments, { type DocumentsFilters } from '../../hooks/sunat/useGetDocuments'
import { mapDocumentToSunatDocument } from '../../utils/sunatHelpers'
import Paginator from '../ui/Paginator'
import useAuthStore from '../../store/useAuthStore'

type DateFilterTab = 'today' | 'this_week' | 'last_seven_days' | 'this_month' | 'this_year' | 'all'
type ViewTab = 'lista' | 'charts'

const FacturacionTab = () => {
  const [page, setPage] = useState(1)
  const [viewTab, setViewTab] = useState<ViewTab>('lista')
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [dateFilterTab, setDateFilterTab] = useState<DateFilterTab>('all')
  const [filters, setFilters] = useState<DocumentsFilters>({
    document_type: undefined,
    date_filter: undefined,
    date: '',
    start_date: '',
    end_date: '',
    year: undefined,
  })

  const access = useAuthStore(state => state.access) || ''

  // Generate available years (current year and next 5 years)
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: 6 }, (_, i) => currentYear + i)
  }, [])
  
  // Generate month buttons (Ene, Feb, Mar, etc.)
  const months = [
    { value: 0, label: 'Ene' },
    { value: 1, label: 'Feb' },
    { value: 2, label: 'Mar' },
    { value: 3, label: 'Abr' },
    { value: 4, label: 'May' },
    { value: 5, label: 'Jun' },
    { value: 6, label: 'Jul' },
    { value: 7, label: 'Ago' },
    { value: 8, label: 'Sep' },
    { value: 9, label: 'Oct' },
    { value: 10, label: 'Nov' },
    { value: 11, label: 'Dic' },
  ]

  // Handle month filter
  const handleMonthClick = (month: number) => {
    if (selectedMonth === month) {
      // Deselect if clicking the same month
      setSelectedMonth(null)
      setFilters(prev => ({
        ...prev,
        start_date: '',
        end_date: '',
        date_filter: undefined,
        year: undefined
      }))
      setDateFilterTab('all')
    } else {
      setSelectedMonth(month)
      const startDate = new Date(selectedYear, month, 1)
      const endDate = new Date(selectedYear, month + 1, 0)
      setFilters(prev => ({
        ...prev,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        date_filter: undefined,
        year: selectedYear
      }))
      setDateFilterTab('all')
    }
    setPage(1)
  }

  // Handle year change
  const handleYearChange = (year: number) => {
    setSelectedYear(year)
    // If a month is selected, update the date range for the new year
    if (selectedMonth !== null) {
      const startDate = new Date(year, selectedMonth, 1)
      const endDate = new Date(year, selectedMonth + 1, 0)
      setFilters(prev => ({
        ...prev,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        year: year
      }))
    } else {
      // Just set the year filter
      setFilters(prev => ({
        ...prev,
        year: year
      }))
    }
    setPage(1)
  }

  // Update filters when date range tab changes
  useEffect(() => {
    if (dateFilterTab === 'all') {
      // Only clear date_filter and date, but keep start_date/end_date if month is selected
      setFilters(prev => {
        // If month is selected, keep start_date, end_date, and year
        if (selectedMonth !== null) {
          return {
            ...prev,
            date_filter: undefined,
            date: ''
          }
        }
        // Otherwise clear everything except year if it's set
        return {
          ...prev,
          date_filter: undefined,
          date: '',
          start_date: '',
          end_date: ''
        }
      })
    } else {
      // When selecting a date range tab, clear month selection and use date_filter
      setSelectedMonth(null)
      setFilters(prev => ({
        ...prev,
        date_filter: dateFilterTab,
        date: '', // Clear specific date when using range
        start_date: '', // Clear month dates
        end_date: '', // Clear month dates
        year: undefined // Clear year when using date_filter
      }))
    }
    setPage(1)
  }, [dateFilterTab, selectedMonth])

  // Check if filters have any active values
  const hasFilterValues = useMemo(() => {
    return !!(
      filters.document_type ||
      filters.date_filter ||
      filters.date ||
      filters.start_date ||
      filters.end_date ||
      filters.year
    )
  }, [filters])

  const { data: documentsData, isLoading, error, refetch } = useGetDocuments({
    access,
    page,
    filters: hasFilterValues ? filters : undefined
  })

  // Map API documents to UI format
  const documents = useMemo(() => {
    if (!documentsData?.results) return []
    return documentsData.results.map(mapDocumentToSunatDocument)
  }, [documentsData])

  const handleFilterChange = (key: keyof DocumentsFilters, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }))
    setPage(1) // Reset to first page when filters change
    // If changing date manually, switch to 'all' tab and clear month
    if ((key === 'date' || key === 'start_date' || key === 'end_date') && value) {
      setDateFilterTab('all')
      setSelectedMonth(null)
      setFilters(prev => ({ ...prev, date_filter: undefined }))
    }
    // If clearing start_date or end_date manually, clear month selection
    if ((key === 'start_date' || key === 'end_date') && !value) {
      setSelectedMonth(null)
    }
  }

  const clearFilters = () => {
    setFilters({
      document_type: undefined,
      date_filter: undefined,
      date: '',
      start_date: '',
      end_date: '',
      year: undefined,
    })
    setDateFilterTab('all')
    setSelectedMonth(null)
    setSelectedYear(new Date().getFullYear())
    setPage(1)
  }

  const hasActiveFilters = filters.document_type || filters.date_filter || filters.date || filters.start_date || filters.end_date || filters.year || selectedMonth !== null

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <p className="text-red-500 text-lg">Error al cargar los documentos</p>
        <p className="text-red-400 text-sm mt-2">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* View Tabs */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Vista:</span>
          <div className="flex gap-2">
            {[
              { id: 'lista' as ViewTab, label: 'Lista', icon: List },
              { id: 'charts' as ViewTab, label: 'Gráficos', icon: BarChart3 }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setViewTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    viewTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Year and Month Filter */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Año:</span>
            <div className="flex gap-2">
              {availableYears.map((year) => (
                <motion.button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-colors ${
                    selectedYear === year
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {year}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Mes:</span>
            <div className="flex flex-wrap gap-2">
              {months.map((month) => (
                <motion.button
                  key={month.value}
                  onClick={() => handleMonthClick(month.value)}
                  className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-colors ${
                    selectedMonth === month.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {month.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Tabs */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm font-medium text-gray-700">Período:</span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'today' as DateFilterTab, label: 'Hoy' },
              { id: 'last_seven_days' as DateFilterTab, label: 'Últimos 7 días' },
              { id: 'this_week' as DateFilterTab, label: 'Esta semana' },
              { id: 'this_month' as DateFilterTab, label: 'Este mes' },
              { id: 'this_year' as DateFilterTab, label: 'Este año' },
              { id: 'all' as DateFilterTab, label: 'Todos' }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => {
                  setDateFilterTab(tab.id)
                  setSelectedMonth(null)
                }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  dateFilterTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Section - Always Visible */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Filtros</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors bg-red-100 text-red-700 hover:bg-red-200"
            >
              <X className="w-4 h-4" />
              <span>Limpiar</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Document Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Documento
            </label>
            <select
              value={filters.document_type || ''}
              onChange={(e) => handleFilterChange('document_type', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            >
              <option value="">Todos</option>
              <option value="boleta">Boleta</option>
              <option value="factura">Factura</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Específica
            </label>
            <input
              type="date"
              value={filters.date || ''}
              onChange={(e) => handleFilterChange('date', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 [color-scheme:light]"
            />
          </div>

          {/* Start Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={filters.start_date || ''}
              onChange={(e) => handleFilterChange('start_date', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 [color-scheme:light]"
            />
          </div>

          {/* End Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Fin
            </label>
            <input
              type="date"
              value={filters.end_date || ''}
              onChange={(e) => handleFilterChange('end_date', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 [color-scheme:light]"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 text-lg mt-4">Cargando documentos...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-red-500 text-lg">Error al cargar los documentos</p>
          <p className="text-red-400 text-sm mt-2">{(error as Error)?.message || 'Error desconocido'}</p>
        </div>
      )}

      {/* Total Amount Summary */}
      {!isLoading && !error && documentsData && documentsData.total_amount !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-4 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total de documentos:</span>
            <span className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat('es-PE', {
                style: 'currency',
                currency: 'PEN'
              }).format(documentsData.total_amount)}
            </span>
          </div>
        </motion.div>
      )}

      {/* Content based on view tab */}
      <AnimatePresence mode="wait">
        {viewTab === 'lista' && !isLoading && !error && (
          <motion.div
            key="lista"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SunatDocumentsList 
              documents={documents} 
              type="documentos" 
              isLoading={isLoading}
            />
            {documentsData && (
              <Paginator
                page={page}
                setPage={setPage}
                itemsCount={documentsData.count}
                itemsPerPage={10}
                refetch={refetch}
              />
            )}
          </motion.div>
        )}

        {viewTab === 'charts' && !isLoading && !error && (
          <motion.div
            key="charts"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <FacturacionCharts documents={documents} isLoading={isLoading} selectedYear={selectedYear} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FacturacionTab

