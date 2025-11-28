import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Receipt, ShoppingCart, Coins, FileText } from 'lucide-react'
import BoletasTab from './BoletasTab'
import FacturasTab from './FacturasTab'
import OrdersTab from './OrdersTab'
import SunatConnectionStatus from './SunatConnectionStatus'

type TabType = 'boletas' | 'facturas' | 'orders'

const TaxesMain = () => {
  const [activeTab, setActiveTab] = useState<TabType>('orders')
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])
  const [documentType, setDocumentType] = useState<'boleta' | 'factura'>('boleta')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [connectionStatus] = useState({
    connected: true,
    lastSync: '2024-01-17T08:00:00',
    environment: 'sandbox' as 'production' | 'sandbox'
  })

  const handleToggleOrder = (orderId: number) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleSelectOrders = (orderIds: number[]) => {
    setSelectedOrders(orderIds)
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
                <OrdersTab
                  key="orders"
                  selectedOrders={selectedOrders}
                  onToggleOrder={handleToggleOrder}
                  onSelectOrders={handleSelectOrders}
                  onDeselectAll={handleDeselectAll}
                  onCreateDocuments={handleCreateDocuments}
                />
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
