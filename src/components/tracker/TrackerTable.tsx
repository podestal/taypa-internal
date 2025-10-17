import { motion } from 'framer-motion'
import type { Category, Transaction } from './TrackerMain'
import { DollarSign } from 'lucide-react'

interface Props {
  transactions: Transaction[]
  categories: Category[]
}

const TrackerTable = ({ transactions, categories }: Props) => {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border"
    >
      <div className="px-4 sm:px-6 py-4 border-b bg-gray-50">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Transacciones</h2>
      </div>
      
      {/* Mobile Card View */}
      <div className="block sm:hidden">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 border-b border-gray-200 last:border-b-0"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {categories.find(cat => cat.id === transaction.categoria)?.name}
                </p>
                <p className="text-xs text-gray-500">{formatDate(transaction.fecha)}</p>
              </div>
              <span className={`text-sm font-bold ${
                transaction.monto >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(transaction.monto)}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{transaction.observaciones}</p>
          </motion.div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Observaciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction, index) => (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(transaction.fecha)}
                </td>
                <td className={`px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  transaction.monto >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(transaction.monto)}
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    categories.find(cat => cat.id === transaction.categoria)?.type === 'income'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {categories.find(cat => cat.id === transaction.categoria)?.name}
                  </span>
                </td>
                <td className="px-4 lg:px-6 py-4 text-sm text-gray-900 max-w-xs lg:max-w-sm truncate">
                  {transaction.observaciones}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <DollarSign size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500 text-sm sm:text-base">No hay transacciones registradas</p>
        </div>
      )}
    </motion.div>
  )
}

export default TrackerTable