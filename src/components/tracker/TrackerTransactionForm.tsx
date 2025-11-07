import { useState } from "react"
import { Calendar, DollarSign, Tag, FileText, Loader2 } from "lucide-react"
import type { UseMutationResult } from "@tanstack/react-query"
import type { CreateTransactionData } from "../../hooks/api/transaction/useCreateTransaction"
import useAuthStore from "../../store/useAuthStore"
import moment from "moment"
import type { Transaction } from "../../services/api/transactionService"
import useGetCategories from "../../hooks/api/category/useGetCategories"
import useNotificationStore from "../../store/useNotificationStore"

interface Props {
  onClose: () => void
  transactionType: 'E' | 'I'
  createTransaction: UseMutationResult<Transaction, Error, CreateTransactionData>
}

const TrackerTransactionForm = ({ onClose, transactionType, createTransaction }: Props) => {
  const access = useAuthStore(state => state.access) || ''
  const addNotification = useNotificationStore(state => state.addNotification)
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    monto: '',
    categoria: 0,
    observaciones: ''
  })
  const [errors, setErrors] = useState({
    monto: '',
    categoria: ''
  })
  const [loading, setLoading] = useState(false)
  
  const validateForm = () => {
    const amountPattern = /^\d+(\.\d+)?$/
    const newErrors = { monto: '', categoria: '' }
    let hasError = false

    if (!formData.monto.trim()) {
      newErrors.monto = 'El monto es requerido'
      hasError = true
    } else if (!amountPattern.test(formData.monto.trim())) {
      newErrors.monto = 'Ingresa un monto válido (solo números y decimales)'
      hasError = true
    }

    if (formData.categoria === 0) {
      newErrors.categoria = 'Selecciona una categoría'
      hasError = true
    }

    setErrors(newErrors)

    if (hasError) {
      addNotification({
        title: 'Error de validación',
        message: 'Revisa los campos resaltados e intenta nuevamente',
        type: 'error'
      })
    }

    return !hasError
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (!validateForm()) {
      setLoading(false)
      return
    }
    const amountValue = parseFloat(formData.monto)
    createTransaction.mutate({
      access: access,
      transaction: {
        transaction_date: moment(formData.fecha).format('YYYY-MM-DD'),
        amount: amountValue,
        category: formData.categoria,
        transaction_type: transactionType,
        account: 1,
        description: formData.observaciones
      }
    }, {
      onSuccess: () => {
        setFormData({ 
          fecha: new Date().toISOString().split('T')[0],
          monto: '', 
          categoria: 0, 
          observaciones: '' 
        })
        setErrors({ monto: '', categoria: '' })
        onClose()
        addNotification({
          title: 'Transacción agregada correctamente',
          message: 'La transacción ha sido agregada correctamente',
          type: 'success'
        })
      },
      onError: (error) => {
        console.error(error);
        addNotification({
          title: 'Error al agregar la transacción',
          message: 'Error al agregar la transacción',
          type: 'error'
        })
      },
      onSettled: () => {
        setLoading(false)
      }
    })

  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === 'monto') {
      const numericPattern = /^\d*(\.\d*)?$/
      if (value === '' || numericPattern.test(value)) {
        setFormData(prev => ({
          ...prev,
          monto: value
        }))
        if (errors.monto) {
          setErrors(prev => ({ ...prev, monto: '' }))
        }
      }
      return
    }

    if (name === 'categoria') {
      setFormData(prev => ({
        ...prev,
        categoria: parseInt(value)
      }))
      if (errors.categoria) {
        setErrors(prev => ({ ...prev, categoria: '' }))
      }
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  

  const { data: categories, isLoading, error, isError, isSuccess } = useGetCategories({access})

  if (isLoading) return <p className="text-gray-500 text-center py-4 animate-pulse">Cargando...</p>

  if (isError) return <p className="text-red-500 text-center py-4">Error: {error?.message}</p>

  if (isSuccess)

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {transactionType === 'E' ? 'Nuevo Gasto' : 'Nuevo Ingreso'}
      </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Fecha
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <DollarSign className="inline w-4 h-4 mr-1" />
                  Monto
                </label>
                <input
                  type="text"
                  name="monto"
                  value={formData.monto}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:border-transparent focus:outline-none ${
                    errors.monto
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.monto && (
                  <p className="mt-1 text-sm text-red-600">{errors.monto}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Tag className="inline w-4 h-4 mr-1" />
                  Categoría
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:border-transparent focus:outline-none ${
                    errors.categoria
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value="0">Seleccionar categoría</option>
                  {categories
                  .filter((category) => !category.is_menu_category)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoria && (
                  <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FileText className="inline w-4 h-4 mr-1" />
                  Observaciones
                </label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleInputChange}
                  placeholder="Descripción de la transacción..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 cursor-pointer text-sm sm:text-base text-gray-600 hover:text-gray-800 transition-colors rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-4 sm:px-6 py-2 cursor-pointer text-white rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    transactionType === 'E' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Agregar'}
                </button>
              </div>
            </form>
    </div>
  )
}

export default TrackerTransactionForm