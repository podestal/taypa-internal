import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Table, BarChart3, Wallet, Landmark, CreditCard } from 'lucide-react'
import TrackerTable from './TrackerTable'
import TrackerTransactions from './TrackerTransactions'
import TrackerFilters from './TrackerFilters'
import TrackerCharts from './TrackerCharts'
import useAuthStore from '../../store/useAuthStore'
import getTransactionService, { type Transaction } from '../../services/api/transactionService'
import { useQuery } from '@tanstack/react-query'
import useGetTransactionStats from '../../hooks/api/transaction/useGetTransactionStats'
import useGetAccounts from '../../hooks/api/account/useGetAccounts'

// Using Transaction type from transactionService

export interface Category {
  id: number
  name: string
  type: 'income' | 'expense'
}

const categories: Category[] = [
    {
        id: 1,
        name: 'Proteinas',
        type: 'expense'
    },
    {
        id: 2,
        name: 'Verduras',
        type: 'expense'
    },
    {
        id: 3,
        name: 'Carbohidratos',
        type: 'expense'
    },
    {
        id: 4,
        name: 'Equipos',
        type: 'expense'
    },
    {
        id: 5,
        name: 'Sueldos',
        type: 'expense'
    },
    {
        id: 6,
        name: 'Servicios',
        type: 'expense'
    },
    {
        id: 7,
        name: 'Otros',
        type: 'expense'
    },
    {
        id: 8,
        name: 'Burger',
        type: 'income'
    },
    {
        id: 9,
        name: 'Pollo',
        type: 'income'
    },
    {
        id: 10,
        name: 'Papas',
        type: 'income'
    }
]

type DateFilter = 'today' | 'last7days' | 'thisWeek' | 'thisMonth' | 'year' | 'custom' | 'all'
type SortBy = 'date' | 'amount' | null
type SortOrder = 'asc' | 'desc'

const TrackerMain = () => {
  const access = useAuthStore(state => state.access) || ''
  const transactionService = getTransactionService()
  
  const [dateFilter, setDateFilter] = useState<DateFilter>('today')
  const [sortBy, setSortBy] = useState<SortBy>(null) // null = API default order
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [typeFilter, setTypeFilter] = useState<'all' | 'I' | 'E'>('all')
  const [activeTab, setActiveTab] = useState<'table' | 'charts'>('table')
  const [currentPage, setCurrentPage] = useState(1)

  const getStatsGranularity = (filter: DateFilter): 'day' | 'week' | 'month' | 'year' => {
    if (filter === 'all' || filter === 'year') return 'year'
    return 'day'
  }

  // Fetch all transactions based on filters
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['all-transactions', dateFilter, selectedYear, typeFilter, startDate, endDate],
    queryFn: async () => {
      console.log('[TrackerMain] Fetching transactions with filters:', { dateFilter, typeFilter, selectedYear, startDate, endDate })
      let allTransactions: Transaction[] = []
      let page = 1
      let hasMore = true
      
      while (hasMore) {
        const params: Record<string, string> = {
          page: page.toString(),
        }
        
        // Date filter - only add if not 'all'
        if (dateFilter && dateFilter !== 'all') {
          // If custom date range, only add if BOTH dates are provided
          if (dateFilter === 'custom') {
            if (startDate && endDate) {
              // Django expects date_filter='custom' AND start_date/end_date
              params.date_filter = 'custom'
              params.start_date = startDate
              params.end_date = endDate
            } else {
              // Don't send request if custom is selected but dates are incomplete
              // Skip this page fetch
              hasMore = false
              break
            }
          } else if (dateFilter === 'year') {
            params.date_filter = 'custom'
            params.start_date = `${selectedYear}-01-01`
            params.end_date = `${selectedYear}-12-31`
          } else {
            // Otherwise use date_filter for predefined ranges
            params.date_filter = dateFilter
          }
        }
        
        // Type filter - only add if not 'all'
        if (typeFilter && typeFilter !== 'all') {
          params.transaction_type = typeFilter
        }
        
        console.log('[TrackerMain] Request params:', params)
        const response = await transactionService.get(access, params)
        console.log('[TrackerMain] Response:', { count: response.results.length, hasNext: !!response.next })
        
        allTransactions = [...allTransactions, ...response.results]
        
        hasMore = !!response.next
        page++
        
        // Safety limit
        if (page > 100) break
      }
      
      console.log('[TrackerMain] Total transactions fetched:', allTransactions.length)
      return allTransactions
    },
    enabled: !!access && activeTab === 'table' && !(dateFilter === 'custom' && (!startDate || !endDate)),
  })

  const {
    data: transactionStats,
    isLoading: isLoadingStats
  } = useGetTransactionStats({
    access,
    period: dateFilter,
    granularity: getStatsGranularity(dateFilter),
    selectedYear,
    startDate,
    endDate
  })

  const { data: accounts = [], isLoading: isLoadingAccounts } = useGetAccounts({ access })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(value)
  }

  const getAccountIcon = (accountType: string) => {
    const type = accountType.toLowerCase()
    if (type.includes('bank') || type.includes('banco')) return Landmark
    if (type.includes('card') || type.includes('tarjeta')) return CreditCard
    return Wallet
  }

  // Transactions are already filtered by the API based on dateFilter and typeFilter
  // No need for additional client-side filtering

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [dateFilter, selectedYear, typeFilter, sortBy, startDate, endDate])

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 flex items-center justify-between flex-wrap gap-4"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Ingresos y Gastos</h1>
          
          {/* Add Transaction Buttons - Moved to header */}
          <div className="flex gap-2">
            <TrackerTransactions />
          </div>
        </motion.div>

        {/* Accounts Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Cuentas</h2>
          </div>

          {isLoadingAccounts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-7 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : accounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {accounts.map((account) => {
                const AccountIcon = getAccountIcon(account.account_type)
                return (
                  <div
                    key={account.id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <p className="text-sm text-gray-500 truncate">{account.account_type}</p>
                        <h3 className="text-base font-semibold text-gray-900 truncate">{account.name}</h3>
                      </div>
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <AccountIcon className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <p className={`text-2xl font-bold mt-3 ${account.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(Number(account.balance))}
                    </p>
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                          account.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {account.is_active ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <p className="text-gray-500">No hay cuentas registradas</p>
            </div>
          )}
        </motion.div>

        {/* Filters Component */}
        <TrackerFilters
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6"
        >
          {/* Tab Buttons */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <motion.button
              onClick={() => {
                setActiveTab('table')
                setCurrentPage(1)
              }}
              className={`px-4 py-2 font-medium text-sm transition-all flex items-center gap-2 border-b-2 ${
                activeTab === 'table'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Table className="w-4 h-4" />
              Tabla
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('charts')}
              className={`px-4 py-2 font-medium text-sm transition-all flex items-center gap-2 border-b-2 ${
                activeTab === 'charts'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 className="w-4 h-4" />
              Gráficos
            </motion.button>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'table' ? (
              <motion.div
                key="table"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <TrackerTable 
                  categories={categories} 
                  transactions={transactions}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  page={currentPage}
                  setPage={setCurrentPage}
                  isLoading={isLoadingTransactions}
                />
                
                {/* Pagination */}

              </motion.div>
            ) : (
              <TrackerCharts 
                categories={categories}
                transactions={transactions}
                stats={transactionStats}
                isLoading={isLoadingStats}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default TrackerMain