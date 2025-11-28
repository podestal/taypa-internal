import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText } from 'lucide-react'
import { type OrderForBilling } from '../../services/api/orderService'
import useCreateInvoice from '../../hooks/sunat/useCreateInvoice'
import useAuthStore from '../../store/useAuthStore'

interface CreateFacturaModalProps {
  isOpen: boolean
  onClose: () => void
  order: OrderForBilling
  onSuccess?: () => void
}

const CreateFacturaModal = ({ isOpen, onClose, order, onSuccess }: CreateFacturaModalProps) => {
  const access = useAuthStore(state => state.access) || ''
  const createInvoice = useCreateInvoice({ access })
  
  const [formData, setFormData] = useState({
    ruc: order.customer_ruc || '',
    razon_social: order.customer_name || '',
    address: order.customer_address || ''
  })
  
  const [errors, setErrors] = useState({
    ruc: '',
    razon_social: '',
    address: ''
  })

  const validateForm = () => {
    const newErrors = { ruc: '', razon_social: '', address: '' }
    let hasError = false

    if (!formData.ruc.trim()) {
      newErrors.ruc = 'El RUC es requerido'
      hasError = true
    } else if (!/^\d{11}$/.test(formData.ruc.trim())) {
      newErrors.ruc = 'El RUC debe tener 11 dígitos'
      hasError = true
    }

    if (!formData.razon_social.trim()) {
      newErrors.razon_social = 'La razón social es requerida'
      hasError = true
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida'
      hasError = true
    }

    setErrors(newErrors)
    return !hasError
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      await createInvoice.mutateAsync({
        order_items: order.order_items,
        ruc: formData.ruc.trim(),
        address: formData.address.trim(),
        order_id: order.id
      })
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error creating factura:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
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
          className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">Crear Factura</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Order Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Orden #{order.order_number}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Total: <span className="font-semibold">{formatCurrency(order.total_amount)}</span>
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Items:</h5>
              <div className="space-y-1">
                {order.order_items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-gray-900 font-medium">
                      {formatCurrency(item.cost * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RUC <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.ruc}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '') // Only numbers
                  setFormData(prev => ({ ...prev, ruc: value }))
                  if (errors.ruc) setErrors(prev => ({ ...prev, ruc: '' }))
                }}
                maxLength={11}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.ruc ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="20123456789"
              />
              {errors.ruc && (
                <p className="text-red-500 text-sm mt-1">{errors.ruc}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razón Social <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.razon_social}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, razon_social: e.target.value }))
                  if (errors.razon_social) setErrors(prev => ({ ...prev, razon_social: '' }))
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.razon_social ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nombre de la empresa"
              />
              {errors.razon_social && (
                <p className="text-red-500 text-sm mt-1">{errors.razon_social}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, address: e.target.value }))
                  if (errors.address) setErrors(prev => ({ ...prev, address: '' }))
                }}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Dirección completa del cliente"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
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
              disabled={createInvoice.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {createInvoice.isPending ? 'Creando...' : 'Crear Factura'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CreateFacturaModal

