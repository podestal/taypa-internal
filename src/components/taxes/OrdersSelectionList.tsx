import { motion } from 'framer-motion'
import { ShoppingCart, CheckCircle2, User, MapPin, Calendar } from 'lucide-react'
import moment from 'moment'

export interface OrderForTaxes {
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

interface Props {
  orders: OrderForTaxes[]
  selectedOrders: number[]
  onToggleOrder: (orderId: number) => void
  onSelectAll: () => void
  onDeselectAll: () => void
  isLoading?: boolean
}

const OrdersSelectionList = ({
  orders,
  selectedOrders,
  onToggleOrder,
  onSelectAll,
  onDeselectAll,
  isLoading
}: Props) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount)
  }

  const allSelected = orders.length > 0 && selectedOrders.length === orders.length
  const someSelected = selectedOrders.length > 0 && selectedOrders.length < orders.length

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
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
            {selectedOrders.length} de {orders.length} órdenes seleccionadas
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={allSelected ? onDeselectAll : onSelectAll}
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
            onClick={() => !hasDocument && onToggleOrder(order.id)}
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
                      <Calendar className="w-4 h-4" />
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
                    <User className="w-4 h-4 text-gray-400" />
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
                    <MapPin className="w-4 h-4 text-gray-400" />
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

export default OrdersSelectionList

