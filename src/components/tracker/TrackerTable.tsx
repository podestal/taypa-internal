import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { Category } from './TrackerMain'
import type { Transaction } from '../../services/api/transactionService'
import { DollarSign } from 'lucide-react'
import moment from 'moment'
import Paginator from '../ui/Paginator'

interface Props {
  categories: Category[]
  transactions: Transaction[]
  sortBy: 'date' | 'amount'
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  isLoading: boolean
}

const ITEMS_PER_PAGE = 10

const TrackerTable = ({ categories, transactions, sortBy, page, setPage, isLoading }: Props) => {
  
  // Sort transactions
  const sortedTransactions = useMemo(() => {
    const sorted = [...transactions]
    sorted.sort((a, b) => {
      let comparison = 0
      
      if (sortBy === 'date') {
        comparison = new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()
      } else if (sortBy === 'amount') {
        comparison = Math.abs(a.amount) - Math.abs(b.amount)
      }
      
      return comparison
    })
    
    return sorted
  }, [transactions, sortBy])

  // Paginate transactions
  const paginatedTransactions = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return sortedTransactions.slice(startIndex, endIndex)
  }, [sortedTransactions, page])

  if (isLoading) return <div className="text-center py-12">Cargando...</div>

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
        {paginatedTransactions.map((transaction, index) => (
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
            {paginatedTransactions.map((transaction, index) => (
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

      {paginatedTransactions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <DollarSign size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500 text-sm sm:text-base">No hay transacciones registradas</p>
        </div>
      )}
      <Paginator page={page} setPage={setPage} itemsCount={sortedTransactions.length} itemsPerPage={ITEMS_PER_PAGE} />
    </motion.div>
  )
}

export default TrackerTable