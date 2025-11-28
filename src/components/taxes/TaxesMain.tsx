import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Receipt, ShoppingCart, Plus, CheckCircle2, Coins, FileText } from 'lucide-react'
import moment from 'moment'
import BoletasTab from './BoletasTab'
import FacturasTab from './FacturasTab'
import SunatConnectionStatus from './SunatConnectionStatus'
import useGetOrdersForBilling from '../../hooks/api/order/useGetOrdersForBilling'
import useAuthStore from '../../store/useAuthStore'
import { type OrderForBilling } from '../../services/api/orderService'
import Paginator from '../ui/Paginator'

interface OrderForTaxes {
  id: number
  order_number: string
  customer_name: string
  customer_ruc?: string
  address_info: string
  total: number
  created_at: string
  status: string
  has_document?: boolean
  document_type?: 'boleta' | 'factura'
}

type TabType = 'boletas' | 'facturas' | 'orders'

const mapOrderForBillingToOrderForTaxes = (order: OrderForBilling): OrderForTaxes => {
  // Determine document type from the document if it exists
  let document_type: 'boleta' | 'factura' | undefined = undefined
  if (order.document) {
    // Assuming document has a type field, adjust based on actual API response
    document_type = order.document.document_type === '03' ? 'boleta' : 'factura'
  }

  return {
    id: order.id,
    order_number: order.order_number,
    customer_name: order.customer_name || '',
    customer_ruc: order.customer_ruc || undefined,
    address_info: order.customer_address || '',
    total: order.total_amount,
    created_at: order.created_at,
    status: order.status,
    has_document: order.has_document,
    document_type
  }
}

const TaxesMain = () => {
  const access = useAuthStore(state => state.access) || ''
  const [activeTab, setActiveTab] = useState<TabType>('orders')
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])
  const [documentType, setDocumentType] = useState<'boleta' | 'factura'>('boleta')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [ordersPage, setOrdersPage] = useState(1)
  const [connectionStatus] = useState({
    connected: true,
    lastSync: '2024-01-17T08:00:00',
    environment: 'sandbox' as 'production' | 'sandbox'
  })

  // Fetch orders from API
  const { data: ordersData, isLoading: isLoadingOrders, error: ordersError } = useGetOrdersForBilling({
    access,
    page: ordersPage
  })

  // Map API orders to UI format
  const orders = useMemo(() => {
    if (!ordersData?.results) return []
    return ordersData.results.map(mapOrderForBillingToOrderForTaxes)
  }, [ordersData])

  const handleToggleOrder = (orderId: number) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleSelectAll = () => {
    const availableOrders = orders.filter(o => !o.has_document).map(o => o.id)
    setSelectedOrders(availableOrders)
  }

  const handleDeselectAll = () => {
    setSelectedOrders([])
  }

  const handleCreateDocuments = () => {
    if (selectedOrders.length === 0) return
    setShowCreateModal(true)
  }

  const confirmCreateDocuments = () => {
    // In real app, this would call the API
    console.log(`Creating ${documentType}s for orders:`, selectedOrders)
    setShowCreateModal(false)
    setSelectedOrders([])
    // Show success message
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount)
  }


  const renderOrdersList = () => {
    const availableOrders = orders.filter(o => !o.has_document)
    const allSelected = availableOrders.length > 0 && selectedOrders.length === availableOrders.length

    if (isLoadingOrders) {
      return (
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 text-lg mt-4">Cargando órdenes...</p>
        </div>
      )
    }

    if (ordersError) {
      return (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-red-500 text-lg">Error al cargar las órdenes</p>
          <p className="text-red-400 text-sm mt-2">{ordersError.message}</p>
        </div>
      )
    }

    if (orders.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No hay órdenes disponibles</p>
          <p className="text-gray-400 text-sm mt-2">
            Las órdenes completadas aparecerán aquí para generar documentos
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {/* Selection Controls */}
        <div className="bg-white rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              {selectedOrders.length} de {availableOrders.length} órdenes seleccionadas
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={allSelected ? handleDeselectAll : handleSelectAll}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                allSelected
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {allSelected ? 'Deseleccionar Todas' : 'Seleccionar Todas'}
            </motion.button>
            {selectedOrders.length > 0 && (
              <motion.button
                onClick={handleCreateDocuments}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4" />
                <span>Crear Documentos</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Orders List */}
        {orders.map((order, index) => {
          const isSelected = selectedOrders.includes(order.id)
          const hasDocument = order.has_document

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all ${
                isSelected
                  ? 'ring-2 ring-blue-600 border-blue-600'
                  : 'hover:shadow-lg'
              } ${hasDocument ? 'opacity-75' : ''}`}
              onClick={() => !hasDocument && handleToggleOrder(order.id)}
            >
              <div className="flex items-start space-x-4">
                {/* Checkbox */}
                <div className="flex-shrink-0 pt-1">
                  {hasDocument ? (
                    <div className="w-6 h-6 rounded border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-gray-400" />
                    </div>
                  ) : (
                    <motion.div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </motion.div>
                  )}
                </div>

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
                        {order.customer_name}
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
                        {order.address_info}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'C' 
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'IP'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status === 'C' ? 'Completada' : order.status === 'IP' ? 'En Proceso' : order.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
        {ordersData && (
          <Paginator
            page={ordersPage}
            setPage={setOrdersPage}
            itemsCount={ordersData.count}
            itemsPerPage={10}
          />
        )}
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-3"
        >
          <Coins className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Impuestos SUNAT</h1>
        </motion.div>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SunatConnectionStatus
            connected={connectionStatus.connected}
            lastSync={connectionStatus.lastSync}
            environment={connectionStatus.environment}
          />
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg"
        >
          <div className="border-b border-gray-200">
            <nav className="flex space-x-1 p-2">
              {[
                { id: 'orders' as TabType, label: 'Órdenes', icon: ShoppingCart },
                { id: 'boletas' as TabType, label: 'Boletas', icon: Receipt },
                { id: 'facturas' as TabType, label: 'Facturas', icon: FileText }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </motion.button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'boletas' && (
                <BoletasTab key="boletas" />
              )}

              {activeTab === 'facturas' && (
                <FacturasTab key="facturas" />
              )}

              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderOrdersList()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Create Document Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Crear Documentos SUNAT
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Documento
                  </label>
                  <div className="flex space-x-4">
                    <motion.button
                      onClick={() => setDocumentType('boleta')}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                        documentType === 'boleta'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Boleta
                    </motion.button>
                    <motion.button
                      onClick={() => setDocumentType('factura')}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                        documentType === 'factura'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Factura
                    </motion.button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Se crearán <span className="font-semibold">{selectedOrders.length}</span> {documentType === 'boleta' ? 'boletas' : 'facturas'} para las órdenes seleccionadas.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    onClick={confirmCreateDocuments}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Crear
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TaxesMain
