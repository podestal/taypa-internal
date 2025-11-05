import { motion } from 'framer-motion'
import type { Category, Transaction } from './TrackerMain'
import { DollarSign } from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import useGetTransactionsByCurrentDay from '../../hooks/api/transaction/useGetTransactionsByCurrentDay'
import moment from 'moment'

interface Props {
  transactions: Transaction[]
  categories: Category[]
}

const TrackerTable = ({ categories }: Props) => {

  const access = useAuthStore((state) => state.access) || ''
  const { data: transactionsPage, isLoading, error, isError, isSuccess } = useGetTransactionsByCurrentDay({ access })

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error: {error.message}</div>

  // const transactions = data?.results || []

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount)
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
        {transactionsPage?.results.map((transaction, index) => (
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
                  {transaction.category}
                </p>
                <p className="text-xs text-gray-500">{moment(transaction.transaction_date).format('DD/MM/YYYY')}</p>
              </div>
              <span className={`text-sm font-bold ${
                transaction.transaction_type === 'I' ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(transaction.amount)}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{transaction.description}</p>
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
            {transactionsPage?.results.map((transaction, index) => (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {moment(transaction.transaction_date).format('DD/MM/YYYY')}
                </td>
                <td className={`px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  transaction.transaction_type === 'I' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    categories.find(cat => cat.id === transaction.category)?.type === 'income'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.category}
                  </span>
                </td>
                <td className="px-4 lg:px-6 py-4 text-sm text-gray-900 max-w-xs lg:max-w-sm truncate">
                  {transaction.description}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactionsPage?.results.length === 0 && (
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