import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Receipt, ShoppingCart, Coins, FileText, FileCheck } from 'lucide-react'
import BoletasTab from './BoletasTab'
import FacturasTab from './FacturasTab'
import OrdersTab from './OrdersTab'
import FacturacionTab from './FacturacionTab'
import SunatConnectionStatus from './SunatConnectionStatus'

type TabType = 'boletas' | 'facturas' | 'orders' | 'facturacion'

const TaxesMain = () => {
  const [activeTab, setActiveTab] = useState<TabType>('orders')
  const [connectionStatus] = useState({
    connected: true,
    lastSync: '2024-01-17T08:00:00',
    environment: 'sandbox' as 'production' | 'sandbox'
  })


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
                { id: 'facturacion' as TabType, label: 'Facturación', icon: FileCheck },
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
              {activeTab === 'orders' && (
                <OrdersTab key="orders" />
              )}

              {activeTab === 'facturacion' && (
                <FacturacionTab key="facturacion" />
              )}

              {activeTab === 'boletas' && (
                <BoletasTab key="boletas" />
              )}

              {activeTab === 'facturas' && (
                <FacturasTab key="facturas" />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TaxesMain
