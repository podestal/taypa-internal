import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Receipt, ShoppingCart, Plus, CheckCircle2, XCircle, RefreshCw, Coins } from 'lucide-react'
import moment from 'moment'

// Types
interface SunatDocument {
  id: number
  numero: string
  serie: string
  fecha_emision: string
  cliente_ruc?: string
  cliente_nombre: string
  cliente_direccion?: string
  total: number
  estado: 'enviado' | 'aceptado' | 'rechazado' | 'pendiente'
  tipo_documento: 'boleta' | 'factura'
  orden_id?: number
}

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

// Mock Data
const mockBoletas: SunatDocument[] = [
  {
    id: 1,
    numero: '000001',
    serie: 'B001',
    fecha_emision: '2024-01-15',
    cliente_nombre: 'Juan Pérez',
    total: 125.50,
    estado: 'aceptado',
    tipo_documento: 'boleta',
    orden_id: 101
  },
  {
    id: 2,
    numero: '000002',
    serie: 'B001',
    fecha_emision: '2024-01-16',
    cliente_nombre: 'María González',
    total: 89.00,
    estado: 'enviado',
    tipo_documento: 'boleta',
    orden_id: 102
  }
]

const mockFacturas: SunatDocument[] = [
  {
    id: 3,
    numero: '000001',
    serie: 'F001',
    fecha_emision: '2024-01-14',
    cliente_ruc: '20123456789',
    cliente_nombre: 'Empresa ABC S.A.C.',
    cliente_direccion: 'Av. Principal 123, Lima',
    total: 450.00,
    estado: 'aceptado',
    tipo_documento: 'factura',
    orden_id: 100
  }
]

const mockOrders: OrderForTaxes[] = [
  {
    id: 103,
    order_number: 'ORD-2024-001',
    customer_name: 'Carlos Rodríguez',
    address_info: 'Calle Los Olivos 456',
    total: 156.75,
    created_at: '2024-01-17T10:30:00',
    status: 'C'
  },
  {
    id: 104,
    order_number: 'ORD-2024-002',
    customer_name: 'Ana Martínez',
    customer_ruc: '20123456790',
    address_info: 'Av. Miraflores 789',
    total: 320.50,
    created_at: '2024-01-17T11:15:00',
    status: 'C'
  },
  {
    id: 105,
    order_number: 'ORD-2024-003',
    customer_name: 'Luis Sánchez',
    address_info: 'Jr. Libertad 321',
    total: 78.90,
    created_at: '2024-01-17T12:00:00',
    status: 'C',
    has_document: true,
    document_type: 'boleta'
  }
]

const TaxesMain = () => {
  const [activeTab, setActiveTab] = useState<TabType>('orders')
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])
  const [documentType, setDocumentType] = useState<'boleta' | 'factura'>('boleta')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState({
    connected: true,
    lastSync: '2024-01-17T08:00:00',
    environment: 'sandbox' as 'production' | 'sandbox'
  })

  // Mock orders data (in real app, this would come from API)
  const [orders] = useState<OrderForTaxes[]>(mockOrders)
  const [boletas] = useState<SunatDocument[]>(mockBoletas)
  const [facturas] = useState<SunatDocument[]>(mockFacturas)

  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      setConnectionStatus({
        ...connectionStatus,
        lastSync: new Date().toISOString()
      })
    }, 2000)
  }

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

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'aceptado':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'rechazado':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'enviado':
        return <RefreshCw className="w-5 h-5 text-yellow-600 animate-spin" />
      default:
        return <RefreshCw className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'aceptado':
        return 'bg-green-100 text-green-800'
      case 'rechazado':
        return 'bg-red-100 text-red-800'
      case 'enviado':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount)
  }

  const renderDocumentsList = (documents: SunatDocument[], type: 'boletas' | 'facturas') => {
    if (documents.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No hay {type} registradas</p>
          <p className="text-gray-400 text-sm mt-2">
            Las {type} aparecerán aquí una vez que se generen desde las órdenes
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {documents.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {type === 'boletas' ? 'Boleta' : 'Factura'} {doc.serie}-{doc.numero}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Emitida el {moment(doc.fecha_emision).format('DD/MM/YYYY')}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Cliente:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {doc.cliente_nombre}
                    </span>
                  </div>
                  {type === 'facturas' && doc.cliente_ruc && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">RUC:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {doc.cliente_ruc}
                      </span>
                    </div>
                  )}
                  {type === 'facturas' && doc.cliente_direccion && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Dirección:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {doc.cliente_direccion}
                      </span>
                    </div>
                  )}
                  {doc.orden_id && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Orden ID:</span>
                      <span className="text-sm font-medium text-gray-900">
                        #{doc.orden_id}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(doc.estado)}`}>
                  {getStatusIcon(doc.estado)}
                  <span className="capitalize">{doc.estado}</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(doc.total)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
              <motion.button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FileText className="w-4 h-4" />
                <span>Descargar PDF</span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  const renderOrdersList = () => {
    const availableOrders = orders.filter(o => !o.has_document)
    const allSelected = availableOrders.length > 0 && selectedOrders.length === availableOrders.length

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
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {connectionStatus.connected ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Estado de Conexión SUNAT
                  </h3>
                  <p className={`text-sm font-medium ${
                    connectionStatus.connected ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {connectionStatus.connected ? 'Conectado' : 'Desconectado'}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={handleSync}
                disabled={isSyncing || !connectionStatus.connected}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  connectionStatus.connected && !isSyncing
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                whileHover={connectionStatus.connected && !isSyncing ? { scale: 1.05 } : {}}
                whileTap={connectionStatus.connected && !isSyncing ? { scale: 0.95 } : {}}
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sincronizando...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Sincronizar</span>
                  </>
                )}
              </motion.button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Ambiente</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {connectionStatus.environment === 'production' ? 'Producción' : 'Pruebas'}
                  </p>
                </div>
                {connectionStatus.lastSync && (
                  <div>
                    <p className="text-gray-500">Última Sincronización</p>
                    <p className="font-medium text-gray-900">
                      {moment(connectionStatus.lastSync).format('DD/MM/YYYY HH:mm')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
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
                <motion.div
                  key="boletas"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderDocumentsList(boletas, 'boletas')}
                </motion.div>
              )}

              {activeTab === 'facturas' && (
                <motion.div
                  key="facturas"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderDocumentsList(facturas, 'facturas')}
                </motion.div>
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
