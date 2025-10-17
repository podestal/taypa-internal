import { useState } from "react"
import type { Category, Transaction } from "./TrackerMain"
import { motion } from "framer-motion"
import { Calendar, DollarSign, Tag, FileText } from "lucide-react"

interface Props {
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
  showForm: boolean
  setShowForm: (showForm: boolean) => void
  setTransactionType: (transactionType: 'e' | 'i' | 'n') => void
  categories: Category[]
  transactionType: 'e' | 'i' | 'n'
}
const TrackerTransactionForm = ({ transactions, setTransactions, showForm, setShowForm, setTransactionType, categories, transactionType }: Props) => {

    const [formData, setFormData] = useState({
      fecha: new Date().toISOString().split('T')[0],
      monto: '',
      categoria: 0,
      observaciones: ''
    })
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        fecha: formData.fecha,
        monto: parseFloat(formData.monto),
        categoria: formData.categoria,
        observaciones: formData.observaciones
      }
      
      setTransactions([newTransaction, ...transactions])
      setFormData({ fecha: '', monto: '', categoria: 0, observaciones: '' })
      setShowForm(false)
    }
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.name === 'categoria' ? parseInt(e.target.value) : e.target.value
      })
    }
  return (
    <>
    {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 bg-white rounded-xl shadow-lg p-4 sm:p-6 border w-full"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Nueva Transacción</h2>
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
                  type="number"
                  step="0.01"
                  name="monto"
                  value={formData.monto}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                  required
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="0">Seleccionar categoría</option>
                  {categories
                  .filter((category) => category.type === (transactionType === 'e' ? 'expense' : 'income'))
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
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

              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setTransactionType('n')
                  }}
                  className="px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 transition-colors rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 sm:px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  Agregar
                </button>
              </div>
            </form>
          </motion.div>
        )}
    </>
  )
}

export default TrackerTransactionForm