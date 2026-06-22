import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, X, Receipt, FileText } from 'lucide-react'
import moment from 'moment'
import useGetOrdersForBilling, { type OrdersForBillingFilters } from '../../hooks/api/order/useGetOrdersForBilling'
import useAuthStore from '../../store/useAuthStore'
import { type OrderForBilling } from '../../services/api/orderService'
import Paginator from '../ui/Paginator'
import CreateBoletaModal from './CreateBoletaModal'
import CreateFacturaModal from './CreateFacturaModal'

type DateRangeTab = 'today' | 'last7days' | 'thisWeek' | 'thisMonth' | 'all'

interface OrderForTaxes {
  id: number
  order_number: string
  customer_name: string
  customer_ruc?: string
  address_info: string
  total: number
  created_at: string
  status: string
  order_type: string
  has_document?: boolean
  document_type?: 'boleta' | 'factura'
}

const STATUS_LABELS: Record<string, string> = {
  'IP': 'En Progreso',
  'IK': 'En Cocina',
  'PA': 'Empacando',
  'HA': 'Entregado',
  'IT': 'En Tránsito',
  'DO': 'Entregado',
  'CA': 'Cancelado',
}

const STATUS_COLORS: Record<string, string> = {
  'IP': 'bg-yellow-100 text-yellow-800',
  'IK': 'bg-blue-100 text-blue-800',
  'PA': 'bg-purple-100 text-purple-800',
  'HA': 'bg-green-100 text-green-800',
  'IT': 'bg-indigo-100 text-indigo-800',
  'DO': 'bg-green-100 text-green-800',
  'CA': 'bg-red-100 text-red-800',
}

const ORDER_TYPE_LABELS: Record<string, string> = {
  'T': 'Mesa',
  'D': 'Delivery',
  'G': 'Para Llevar',
}

const mapOrderForBillingToOrderForTaxes = (order: OrderForBilling): OrderForTaxes => {
  let document_type: 'boleta' | 'factura' | undefined = undefined
  // document is string | null, so we check if it exists
  // The document_type is determined from has_document flag and will be set elsewhere if needed

  return {
    id: order.id,
    order_number: order.order_number,
    customer_name: order.customer_name || '',
    customer_ruc: order.customer_ruc || undefined,
    address_info: order.customer_address || '',
    total: order.total_amount,
    created_at: order.created_at,
    status: order.status,
    order_type: order.order_type,
    has_document: order.has_document,
    document_type
  }
}

interface OrdersTabProps {
}

const OrdersTab = ({}: OrdersTabProps) => {
  const access = useAuthStore(state => state.access) || ''
  const [page, setPage] = useState(1)
  const [dateRangeTab, setDateRangeTab] = useState<DateRangeTab>('all')
  const [showBoletaModal, setShowBoletaModal] = useState(false)
  const [showFacturaModal, setShowFacturaModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderForBilling | null>(null)
  const [filters, setFilters] = useState<OrdersForBillingFilters>({
    status: '',
    date: '',
    start_date: '',
    end_date: '',
  })

  // Calculate date ranges based on selected tab
  const getDateRange = (tab: DateRangeTab): { start_date: string; end_date: string } | null => {
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    
    switch (tab) {
      case 'today': {
        const start = new Date(today)
        start.setHours(0, 0, 0, 0)
        return {
          start_date: start.toISOString().split('T')[0],
          end_date: today.toISOString().split('T')[0]
        }
      }
      case 'last7days': {
        const start = new Date(today)
        start.setDate(start.getDate() - 6)
        start.setHours(0, 0, 0, 0)
        return {
          start_date: start.toISOString().split('T')[0],
          end_date: today.toISOString().split('T')[0]
        }
      }
      case 'thisWeek': {
        const start = new Date(today)
        const day = start.getDay()
        const diff = start.getDate() - day + (day === 0 ? -6 : 1) // Adjust to Monday
        start.setDate(diff)
        start.setHours(0, 0, 0, 0)
        return {
          start_date: start.toISOString().split('T')[0],
          end_date: today.toISOString().split('T')[0]
        }
      }
      case 'thisMonth': {
        const start = new Date(today.getFullYear(), today.getMonth(), 1)
        return {
          start_date: start.toISOString().split('T')[0],
          end_date: today.toISOString().split('T')[0]
        }
      }
      case 'all':
      default:
        return null
    }
  }

  // Update filters when date range tab changes
  useEffect(() => {
    const dateRange = getDateRange(dateRangeTab)
    if (dateRange) {
      setFilters(prev => ({
        ...prev,
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        date: '' // Clear specific date when using range
      }))
    } else {
      setFilters(prev => ({
        ...prev,
        start_date: '',
        end_date: '',
        date: ''
      }))
    }
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRangeTab])

  const { data: ordersData, isLoading, error, refetch } = useGetOrdersForBilling({
    access,
    page,
    filters: Object.values(filters).some(v => v) ? filters : undefined
  })

  const orders = useMemo(() => {
    if (!ordersData?.results) return []
    return ordersData.results.map(mapOrderForBillingToOrderForTaxes)
  }, [ordersData])

  // Get full OrderForBilling object for selected order
  const selectedOrderData = useMemo(() => {
    if (!ordersData?.results || !selectedOrder) return null
    return ordersData.results.find(order => order.id === selectedOrder.id) || null
  }, [ordersData, selectedOrder])

  const handleFilterChange = (key: keyof OrdersForBillingFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1) // Reset to first page when filters change
    // If changing date manually, switch to 'all' tab
    if ((key === 'date' || key === 'start_date' || key === 'end_date') && value) {
      setDateRangeTab('all')
    }
  }

  const clearFilters = () => {
    setFilters({
      status: '',
      date: '',
      start_date: '',
      end_date: '',
    })
    setDateRangeTab('all')
    setPage(1)
  }

  const hasActiveFilters = filters.status !== '' || filters.date !== ''

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {/* Date Range Tabs */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm font-medium text-gray-700">Período:</span>
          <div className="flex space-x-2">
            {[
              { id: 'today' as DateRangeTab, label: 'Hoy' },
              { id: 'last7days' as DateRangeTab, label: 'Últimos 7 días' },
              { id: 'thisWeek' as DateRangeTab, label: 'Esta semana' },
              { id: 'thisMonth' as DateRangeTab, label: 'Este mes' },
              { id: 'all' as DateRangeTab, label: 'Todos' }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setDateRangeTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  dateRangeTab === tab.id
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            >
              <option value="">Todos</option>
              <option value="IP">En Progreso</option>
              <option value="IK">En Cocina</option>
              <option value="PA">Empacando</option>
              <option value="HA">Entregado</option>
              <option value="IT">En Tránsito</option>
              <option value="DO">Entregado</option>
              <option value="CA">Cancelado</option>
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
              onChange={(e) => handleFilterChange('date', e.target.value)}
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
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
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
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 [color-scheme:light]"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 text-lg mt-4">Cargando órdenes...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-red-500 text-lg">Error al cargar las órdenes</p>
          <p className="text-red-400 text-sm mt-2">{error.message}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && orders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No hay órdenes disponibles</p>
          <p className="text-gray-400 text-sm mt-2">
            Las órdenes completadas aparecerán aquí para generar documentos
          </p>
        </div>
      )}


      {/* Orders List */}
      {!isLoading && !error && orders.length > 0 && orders.map((order, index) => {
        // Get full order data to check document
        const fullOrder = ordersData?.results?.find(o => o.id === order.id)
        const hasDocument = fullOrder?.has_document || (fullOrder?.document !== null && fullOrder?.document !== undefined && fullOrder?.document !== '')
        const isDisabled = hasDocument

        return (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-lg shadow-md p-6 transition-all ${
              isDisabled ? 'opacity-60' : 'hover:shadow-lg'
            }`}
          >
            <div className="flex items-start space-x-4">
              {/* Order Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                      <h4 className="text-lg font-semibold text-gray-900">
                        Orden #{order.order_number}
                      </h4>
                      {hasDocument && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {order.document_type === 'boleta' ? 'Boleta' : 'Factura'} Generada
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 flex items-center space-x-1">
                      <span>
                        {moment(order.created_at).format('DD/MM/YYYY HH:mm')}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-600">Cliente:</span>
                    <span className="font-medium text-gray-900">
                      {order.customer_name || 'Sin nombre'}
                    </span>
                    {order.customer_ruc && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">RUC:</span>
                        <span className="font-medium text-gray-900">
                          {order.customer_ruc}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-600">Dirección:</span>
                    <span className="font-medium text-gray-900">
                      {order.address_info || 'Sin dirección'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'
                      }`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {ORDER_TYPE_LABELS[order.order_type] || order.order_type}
                      </span>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-auto">
                      <motion.button
                        onClick={() => {
                          if (fullOrder) {
                            setSelectedOrder(fullOrder)
                            setShowBoletaModal(true)
                          }
                        }}
                        disabled={isDisabled}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={!isDisabled ? { scale: 1.05 } : {}}
                        whileTap={!isDisabled ? { scale: 0.95 } : {}}
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Boleta</span>
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          if (fullOrder) {
                            setSelectedOrder(fullOrder)
                            setShowFacturaModal(true)
                          }
                        }}
                        disabled={isDisabled}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={!isDisabled ? { scale: 1.05 } : {}}
                        whileTap={!isDisabled ? { scale: 0.95 } : {}}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Factura</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}

      {/* Paginator */}
      {!isLoading && !error && ordersData && (
        <Paginator
          page={page}
          setPage={setPage}
          itemsCount={ordersData.count}
          itemsPerPage={10}
          refetch={refetch}
        />
      )}

      {/* Modals */}
      {selectedOrderData && (
        <>
          <CreateBoletaModal
            isOpen={showBoletaModal}
            onClose={() => {
              setShowBoletaModal(false)
              setSelectedOrder(null)
            }}
            order={selectedOrderData}
            onSuccess={() => {
              setSelectedOrder(null)
              refetch()
            }}
          />

          <CreateFacturaModal
            isOpen={showFacturaModal}
            onClose={() => {
              setShowFacturaModal(false)
              setSelectedOrder(null)
            }}
            order={selectedOrderData}
            onSuccess={() => {
              setSelectedOrder(null)
              refetch()
            }}
          />
        </>
      )}
    </div>
  )
}

export default OrdersTab

