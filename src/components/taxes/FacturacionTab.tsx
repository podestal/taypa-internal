import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import SunatDocumentsList from './SunatDocumentsList'
import useGetDocuments, { type DocumentsFilters } from '../../hooks/sunat/useGetDocuments'
import { mapDocumentToSunatDocument } from '../../utils/sunatHelpers'
import Paginator from '../ui/Paginator'
import useAuthStore from '../../store/useAuthStore'

type DateFilterTab = 'today' | 'this_week' | 'last_seven_days' | 'this_month' | 'this_year' | 'all'

const FacturacionTab = () => {
  const [page, setPage] = useState(1)
  const [dateFilterTab, setDateFilterTab] = useState<DateFilterTab>('all')
  const [filters, setFilters] = useState<DocumentsFilters>({
    document_type: undefined,
    date_filter: undefined,
    date: '',
    start_date: '',
    end_date: '',
  })

  const access = useAuthStore(state => state.access) || ''

  // Update filters when date range tab changes
  useEffect(() => {
    if (dateFilterTab === 'all') {
      setFilters(prev => ({
        ...prev,
        date_filter: undefined,
        date: '',
        start_date: '',
        end_date: ''
      }))
    } else {
      setFilters(prev => ({
        ...prev,
        date_filter: dateFilterTab,
        date: '', // Clear specific date when using range
      }))
    }
    setPage(1)
  }, [dateFilterTab])

  const { data: documentsData, isLoading, error, refetch } = useGetDocuments({
    access,
    page,
    filters: Object.values(filters).some(v => v) ? filters : undefined
  })

  // Map API documents to UI format
  const documents = useMemo(() => {
    if (!documentsData?.results) return []
    return documentsData.results.map(mapDocumentToSunatDocument)
  }, [documentsData])

  const handleFilterChange = (key: keyof DocumentsFilters, value: string | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }))
    setPage(1) // Reset to first page when filters change
    // If changing date manually, switch to 'all' tab
    if ((key === 'date' || key === 'start_date' || key === 'end_date') && value) {
      setDateFilterTab('all')
      setFilters(prev => ({ ...prev, date_filter: undefined }))
    }
  }

  const clearFilters = () => {
    setFilters({
      document_type: undefined,
      date_filter: undefined,
      date: '',
      start_date: '',
      end_date: '',
    })
    setDateFilterTab('all')
    setPage(1)
  }

  const hasActiveFilters = filters.document_type || filters.date_filter || filters.date || filters.start_date || filters.end_date

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
                onClick={() => setDateFilterTab(tab.id)}
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

      {/* Documents List */}
      {!isLoading && !error && (
        <motion.div
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
    </div>
  )
}

export default FacturacionTab

