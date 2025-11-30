import { motion, AnimatePresence } from 'framer-motion'
import { X, Receipt } from 'lucide-react'
import moment from 'moment'
import { type OrderForBilling } from '../../services/api/orderService'
import useCreateTicket from '../../hooks/sunat/useCreateTicket'
import useAuthStore from '../../store/useAuthStore'
import useNotificationStore from '../../store/useNotificationStore'
import axios from 'axios'

interface CreateBoletaModalProps {
  isOpen: boolean
  onClose: () => void
  order: OrderForBilling
  onSuccess?: () => void
}

const CreateBoletaModal = ({ isOpen, onClose, order }: CreateBoletaModalProps) => {
  const access = useAuthStore(state => state.access) || ''
  const createTicket = useCreateTicket({ access })
  const addNotification = useNotificationStore(state => state.addNotification)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount)
  }

  const handleSubmit = () => {
      createTicket.mutate({
        order_items: order.order_items.map(item => ({
          id: item.id.toString(),
          name: item.name,
          quantity: item.quantity,
          cost: Number((item.cost / item.quantity).toFixed(2))
        })),
        order_id: order.id
      }, {
        onSuccess: async (res) => {
          addNotification({
            title: 'Boleta creada correctamente',
            message: 'La boleta ha sido creada correctamente',
            type: 'success'
          })
          onClose()
          try {
            const response = await axios.post(
              `${import.meta.env.VITE_TAXES_URL}documents/generate-ticket/`,
              {
                sunat_id: res.sunat_id,
                document_type: 'boleta',
              },
              {
                responseType: 'blob',
                headers: {
                  'Authorization': `JWT ${access}`,
                },
              }
            );
        
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            
            // Open in new tab
            window.open(url, '_blank');
            
            // Clean up URL after a delay (optional)
            // setTimeout(() => window.URL.revokeObjectURL(url), 100);
          } catch (error) {
            console.error('Error generating ticket:', error);
          }
        },
        onError: (error) => {
          console.error('Error creating boleta:', error)
        }
      })
    }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <> {console.log('order', order)} </>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Receipt className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Crear Boleta
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Orden #{order.order_number}
                </h4>
                <p className="text-sm text-gray-500">
                  {moment(order.created_at).format('DD/MM/YYYY HH:mm')}
                </p>
                {order.customer_name && (
                  <p className="text-sm text-gray-600 mt-1">
                    Cliente: {order.customer_name}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(order.total_amount)}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Items:</h5>
              <div className="space-y-1">
                {order.order_items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-gray-900 font-medium">
                      {formatCurrency(item.cost)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Total Summary */}
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">
                Total:
              </span>
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(order.total_amount)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 justify-end">
            <motion.button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancelar
            </motion.button>
            <motion.button
              onClick={handleSubmit}
              disabled={createTicket.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {createTicket.isPending ? 'Creando...' : 'Crear Boleta'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CreateBoletaModal

