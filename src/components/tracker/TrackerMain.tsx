import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Table, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react'
import TrackerTable from './TrackerTable'
import TrackerTransactions from './TrackerTransactions'
import TrackerDateFilters from './TrackerDateFilters'
import TrackerTypeFilters from './TrackerTypeFilters'
import TrackerSorter from './TrackerSorter'

// Transaction interface
export interface Transaction {
  id: string
  fecha: string
  monto: number
  categoria: number
  observaciones: string
}

// Dummy data with 30 realistic mixed restaurant transactions
const initialTransactions: Transaction[] = [
  {
    id: '1',
    fecha: '2024-01-16',
    monto: 89.50,
    categoria: 8,
    observaciones: 'Hamburguesas del desayuno'
  },
  {
    id: '2',
    fecha: '2024-01-16',
    monto: -45.20,
    categoria: 1,
    observaciones: 'Compra carne molida del día'
  },
  {
    id: '3',
    fecha: '2024-01-16',
    monto: 156.75,
    categoria: 9,
    observaciones: 'Pedidos de pollo al mediodía'
  },
  {
    id: '4',
    fecha: '2024-01-16',
    monto: -32.40,
    categoria: 2,
    observaciones: 'Verduras frescas del mercado'
  },
  {
    id: '5',
    fecha: '2024-01-16',
    monto: 78.90,
    categoria: 10,
    observaciones: 'Papas fritas y combos'
  },
  {
    id: '6',
    fecha: '2024-01-16',
    monto: -125.80,
    categoria: 5,
    observaciones: 'Pago personal de cocina'
  },
  {
    id: '7',
    fecha: '2024-01-15',
    monto: 245.50,
    categoria: 8,
    observaciones: 'Hamburguesas premium del mediodía'
  },
  {
    id: '8',
    fecha: '2024-01-15',
    monto: -68.75,
    categoria: 3,
    observaciones: 'Pan de hamburguesa y papas'
  },
  {
    id: '9',
    fecha: '2024-01-15',
    monto: 180.75,
    categoria: 9,
    observaciones: 'Pollo a la parrilla del día'
  },
  {
    id: '10',
    fecha: '2024-01-15',
    monto: -89.30,
    categoria: 1,
    observaciones: 'Pechugas de pollo frescas'
  },
  {
    id: '11',
    fecha: '2024-01-15',
    monto: 95.25,
    categoria: 10,
    observaciones: 'Papas deluxe con toppings'
  },
  {
    id: '12',
    fecha: '2024-01-15',
    monto: -156.80,
    categoria: 5,
    observaciones: 'Salarios personal de servicio'
  },
  {
    id: '13',
    fecha: '2024-01-14',
    monto: 320.00,
    categoria: 8,
    observaciones: 'Venta nocturna de hamburguesas'
  },
  {
    id: '14',
    fecha: '2024-01-14',
    monto: -45.20,
    categoria: 2,
    observaciones: 'Tomates, lechuga y cebollas'
  },
  {
    id: '15',
    fecha: '2024-01-14',
    monto: 156.80,
    categoria: 9,
    observaciones: 'Alitas de pollo y ensaladas'
  },
  {
    id: '16',
    fecha: '2024-01-14',
    monto: -78.90,
    categoria: 4,
    observaciones: 'Mantenimiento freidora'
  },
  {
    id: '17',
    fecha: '2024-01-14',
    monto: 78.50,
    categoria: 10,
    observaciones: 'Papas fritas y aros de cebolla'
  },
  {
    id: '18',
    fecha: '2024-01-14',
    monto: -32.40,
    categoria: 7,
    observaciones: 'Productos de limpieza'
  },
  {
    id: '19',
    fecha: '2024-01-13',
    monto: 425.75,
    categoria: 8,
    observaciones: 'Día de promoción hamburguesas'
  },
  {
    id: '20',
    fecha: '2024-01-13',
    monto: -125.50,
    categoria: 1,
    observaciones: 'Carne molida premium'
  },
  {
    id: '21',
    fecha: '2024-01-13',
    monto: 203.40,
    categoria: 9,
    observaciones: 'Menú ejecutivo de pollo'
  },
  {
    id: '22',
    fecha: '2024-01-13',
    monto: -89.50,
    categoria: 6,
    observaciones: 'Luz, agua y gas'
  },
  {
    id: '23',
    fecha: '2024-01-13',
    monto: 125.60,
    categoria: 10,
    observaciones: 'Combo papas + bebidas'
  },
  {
    id: '24',
    fecha: '2024-01-13',
    monto: -245.60,
    categoria: 5,
    observaciones: 'Pago personal completo'
  },
  {
    id: '25',
    fecha: '2024-01-12',
    monto: 298.90,
    categoria: 8,
    observaciones: 'Venta fin de semana'
  },
  {
    id: '26',
    fecha: '2024-01-12',
    monto: -68.75,
    categoria: 2,
    observaciones: 'Verduras del fin de semana'
  },
  {
    id: '27',
    fecha: '2024-01-12',
    monto: 189.45,
    categoria: 9,
    observaciones: 'Pollo especial del fin de semana'
  },
  {
    id: '28',
    fecha: '2024-01-12',
    monto: -45.75,
    categoria: 7,
    observaciones: 'Limpieza y productos de aseo'
  },
  {
    id: '29',
    fecha: '2024-01-12',
    monto: 112.30,
    categoria: 10,
    observaciones: 'Papas especiales del fin de semana'
  },
  {
    id: '30',
    fecha: '2024-01-12',
    monto: -156.80,
    categoria: 3,
    observaciones: 'Pan y carbohidratos para el fin de semana'
  }
]

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

type DateFilter = 'today' | 'last7days' | 'thisWeek' | 'thisMonth' | 'custom' | 'all'
type SortBy = 'date' | 'amount'
type SortOrder = 'asc' | 'desc'

const TrackerMain = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [dateFilter, setDateFilter] = useState<DateFilter>('today')
  const [sortBy, setSortBy] = useState<SortBy>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'I' | 'E'>('all')
  const [activeTab, setActiveTab] = useState<'table' | 'charts'>('table')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Get date range based on filter
  const getDateRange = (filter: DateFilter): { start: Date; end: Date } | null => {
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    
    switch (filter) {
      case 'today': {
        const start = new Date(today)
        start.setHours(0, 0, 0, 0)
        return { start, end: today }
      }
      case 'last7days': {
        const start = new Date(today)
        start.setDate(start.getDate() - 6)
        start.setHours(0, 0, 0, 0)
        return { start, end: today }
      }
      case 'thisWeek': {
        const start = new Date(today)
        const dayOfWeek = start.getDay()
        start.setDate(start.getDate() - dayOfWeek)
        start.setHours(0, 0, 0, 0)
        return { start, end: today }
      }
      case 'thisMonth': {
        const start = new Date(today.getFullYear(), today.getMonth(), 1)
        start.setHours(0, 0, 0, 0)
        return { start, end: today }
      }
      case 'all':
        return null
      default:
        return null
    }
  }

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions]

    // Apply date filter
    if (dateFilter === 'all') {
      // No filter
    } else if (startDate && endDate && dateFilter === 'custom') {
      const start = new Date(startDate)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      filtered = filtered.filter(t => {
        const tDate = new Date(t.fecha)
        return tDate >= start && tDate <= end
      })
    } else {
      const range = getDateRange(dateFilter)
      if (range) {
        filtered = filtered.filter(t => {
          const tDate = new Date(t.fecha)
          return tDate >= range.start && tDate <= range.end
        })
      }
    }

    // Apply type filter (income/expense)
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => {
        const category = categories.find(cat => cat.id === t.categoria)
        if (typeFilter === 'income') {
          return category?.type === 'income'
        } else if (typeFilter === 'expense') {
          return category?.type === 'expense'
        }
        return true
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'fecha':
          comparison = new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
          break
        case 'monto':
          comparison = Math.abs(a.monto) - Math.abs(b.monto)
          break
        case 'categoria':
          comparison = a.categoria - b.categoria
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [transactions, dateFilter, sortBy, sortOrder, startDate, endDate, typeFilter])

  const handleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage)
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredAndSortedTransactions.slice(startIndex, endIndex)
  }, [filteredAndSortedTransactions, currentPage])

  // Chart data calculations - Simple data for visual charts
  const chartData = useMemo(() => {
    // Group by date
    const dateGroups = filteredAndSortedTransactions.reduce((acc, t) => {
      const date = t.fecha
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 }
      }
      if (t.monto >= 0) {
        acc[date].income += t.monto
      } else {
        acc[date].expense += Math.abs(t.monto)
      }
      return acc
    }, {} as Record<string, { date: string; income: number; expense: number }>)

    const sortedDates = Object.values(dateGroups).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    // Category breakdown
    const categoryIncome = filteredAndSortedTransactions
      .filter(t => t.monto >= 0)
      .reduce((acc, t) => {
        const cat = categories.find(c => c.id === t.categoria)
        if (cat) {
          acc[cat.name] = (acc[cat.name] || 0) + t.monto
        }
        return acc
      }, {} as Record<string, number>)

    const categoryExpense = filteredAndSortedTransactions
      .filter(t => t.monto < 0)
      .reduce((acc, t) => {
        const cat = categories.find(c => c.id === t.categoria)
        if (cat) {
          acc[cat.name] = (acc[cat.name] || 0) + Math.abs(t.monto)
        }
        return acc
      }, {} as Record<string, number>)

    const totalIncome = Object.values(categoryIncome).reduce((sum, val) => sum + val, 0)
    const totalExpense = Object.values(categoryExpense).reduce((sum, val) => sum + val, 0)

    return {
      lineData: sortedDates.map(d => ({
        ...d,
        net: d.income - d.expense
      })),
      incomeByCategory: Object.entries(categoryIncome).map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2)),
        percentage: totalIncome > 0 ? (value / totalIncome) * 100 : 0
      })),
      expenseByCategory: Object.entries(categoryExpense).map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2)),
        percentage: totalExpense > 0 ? (value / totalExpense) * 100 : 0
      })),
      totals: {
        income: totalIncome,
        expense: totalExpense,
        net: totalIncome - totalExpense
      }
    }
  }, [filteredAndSortedTransactions])

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [dateFilter, typeFilter, sortBy, startDate, endDate])

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
            <TrackerTransactions categories={categories} transactions={transactions} setTransactions={setTransactions} />
          </div>
        </motion.div>

        {/* Filters and Sorting Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6"
        >
          {/* Date Filter Buttons */}
          <TrackerDateFilters
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
          {/* Type Filter */}
          <TrackerTypeFilters
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
          />

          {/* Sorting Options */}
          <TrackerSorter
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {activeTab === 'table' ? (
                <>
                  {/* Mostrando <span className="font-semibold text-gray-900">
                    {filteredAndSortedTransactions.length > 0 
                      ? `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredAndSortedTransactions.length)}`
                      : '0'
                    }
                  </span> de <span className="font-semibold text-gray-900">{filteredAndSortedTransactions.length}</span> transacciones
                  {filteredAndSortedTransactions.length !== transactions.length && (
                    <span className="ml-2">(filtradas de {transactions.length} totales)</span>
                  )} */}
                </>
              ) : (
                <>
                  {/* Analizando <span className="font-semibold text-gray-900">{filteredAndSortedTransactions.length}</span> transacciones
                  {filteredAndSortedTransactions.length !== transactions.length && (
                    <span className="ml-2">(filtradas de {transactions.length} totales)</span>
                  )} */}
                </>
              )}
            </p>
          </div>
        </motion.div>

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
                  transactions={paginatedTransactions} 
                  categories={categories} 
                  dateFilter={dateFilter} 
                  typeFilter={typeFilter as 'all' | 'I' | 'E'}
                  sortBy={sortBy}
                  page={currentPage}
                  setPage={setCurrentPage}
                />
                
                {/* Pagination */}

              </motion.div>
            ) : (
              <motion.div
                key="charts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                    <p className="text-sm text-green-700 font-medium mb-1">Total Ingresos</p>
                    <p className="text-2xl font-bold text-green-900">
                      ${chartData.totals.income.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                    <p className="text-sm text-red-700 font-medium mb-1">Total Gastos</p>
                    <p className="text-2xl font-bold text-red-900">
                      ${chartData.totals.expense.toFixed(2)}
                    </p>
                  </div>
                  <div className={`rounded-lg p-4 border-l-4 ${
                    chartData.totals.net >= 0 
                      ? 'bg-blue-50 border-blue-500' 
                      : 'bg-orange-50 border-orange-500'
                  }`}>
                    <p className={`text-sm font-medium mb-1 ${
                      chartData.totals.net >= 0 ? 'text-blue-700' : 'text-orange-700'
                    }`}>
                      Ganancia Neta
                    </p>
                    <p className={`text-2xl font-bold ${
                      chartData.totals.net >= 0 ? 'text-blue-900' : 'text-orange-900'
                    }`}>
                      ${chartData.totals.net.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Income vs Expenses by Date */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos vs Gastos por Fecha</h3>
                  <div className="space-y-3">
                    {chartData.lineData.slice(-10).map((item, index) => {
                      const maxValue = Math.max(
                        ...chartData.lineData.map(d => Math.max(d.income, d.expense))
                      )
                      const incomeWidth = maxValue > 0 ? (item.income / maxValue) * 100 : 0
                      const expenseWidth = maxValue > 0 ? (item.expense / maxValue) * 100 : 0
                      
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-700">
                              {new Date(item.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                            </span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-green-600 font-medium">
                                +${item.income.toFixed(2)}
                              </span>
                              <span className="text-red-600 font-medium">
                                -${item.expense.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-green-700 w-16">Ingresos</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-3">
                                <div 
                                  className="bg-green-500 h-3 rounded-full transition-all"
                                  style={{ width: `${incomeWidth}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-red-700 w-16">Gastos</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-3">
                                <div 
                                  className="bg-red-500 h-3 rounded-full transition-all"
                                  style={{ width: `${expenseWidth}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Net Profit Trend */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ganancia Neta por Fecha</h3>
                  <div className="h-64 flex items-end gap-2">
                    {chartData.lineData.slice(-10).map((item, index) => {
                      const maxNet = Math.max(...chartData.lineData.map(d => Math.abs(d.net)))
                      const height = maxNet > 0 ? (Math.abs(item.net) / maxNet) * 100 : 0
                      
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="relative w-full flex flex-col items-center justify-end" style={{ height: '240px' }}>
                            <div
                              className={`w-full rounded-t transition-all ${
                                item.net >= 0 ? 'bg-blue-500' : 'bg-orange-500'
                              }`}
                              style={{ height: `${height}%` }}
                            />
                            <div className="absolute -bottom-6 text-xs text-gray-600 text-center whitespace-nowrap">
                              {new Date(item.date).toLocaleDateString('es-ES', { day: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-8 flex items-center justify-center gap-6 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Positivo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span>Negativo</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Income by Category */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos por Categoría</h3>
                    <div className="space-y-3">
                      {chartData.incomeByCategory.map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-700">{item.name}</span>
                            <span className="text-green-600 font-bold">${item.value.toFixed(2)}</span>
                          </div>
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</p>
                        </div>
                      ))}
                      {chartData.incomeByCategory.length === 0 && (
                        <p className="text-gray-500 text-center py-8">No hay ingresos en este período</p>
                      )}
                    </div>
                  </div>

                  {/* Expenses by Category */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Gastos por Categoría</h3>
                    <div className="space-y-3">
                      {chartData.expenseByCategory.map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-700">{item.name}</span>
                            <span className="text-red-600 font-bold">${item.value.toFixed(2)}</span>
                          </div>
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full transition-all"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</p>
                        </div>
                      ))}
                      {chartData.expenseByCategory.length === 0 && (
                        <p className="text-gray-500 text-center py-8">No hay gastos en este período</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pie Chart Visualizations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Income Distribution */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Ingresos</h3>
                    <div className="flex items-center justify-center">
                      <div className="relative w-64 h-64">
                        {chartData.incomeByCategory.map((item, index) => {
                          const total = chartData.totals.income
                          const percentage = total > 0 ? (item.value / total) * 100 : 0
                          const startAngle = chartData.incomeByCategory
                            .slice(0, index)
                            .reduce((sum, i) => sum + (total > 0 ? (i.value / total) * 360 : 0), 0)
                          const angle = percentage * 3.6
                          
                          return (
                            <div key={index} className="absolute inset-0">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle
                                  cx="50%"
                                  cy="50%"
                                  r="40%"
                                  fill="none"
                                  stroke={COLORS[index % COLORS.length]}
                                  strokeWidth="40"
                                  strokeDasharray={`${angle} 360`}
                                  strokeDashoffset={-startAngle * 3.6}
                                  className="transition-all"
                                />
                              </svg>
                            </div>
                          )
                        })}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">
                              ${chartData.totals.income.toFixed(0)}
                            </p>
                            <p className="text-xs text-gray-600">Total</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      {chartData.incomeByCategory.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="flex-1">{item.name}</span>
                          <span className="font-medium">${item.value.toFixed(2)}</span>
                          <span className="text-gray-500 text-xs">({item.percentage.toFixed(1)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expense Distribution */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Gastos</h3>
                    <div className="flex items-center justify-center">
                      <div className="relative w-64 h-64">
                        {chartData.expenseByCategory.map((item, index) => {
                          const total = chartData.totals.expense
                          const percentage = total > 0 ? (item.value / total) * 100 : 0
                          const startAngle = chartData.expenseByCategory
                            .slice(0, index)
                            .reduce((sum, i) => sum + (total > 0 ? (i.value / total) * 360 : 0), 0)
                          const angle = percentage * 3.6
                          
                          return (
                            <div key={index} className="absolute inset-0">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle
                                  cx="50%"
                                  cy="50%"
                                  r="40%"
                                  fill="none"
                                  stroke={COLORS[index % COLORS.length]}
                                  strokeWidth="40"
                                  strokeDasharray={`${angle} 360`}
                                  strokeDashoffset={-startAngle * 3.6}
                                  className="transition-all"
                                />
                              </svg>
                            </div>
                          )
                        })}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">
                              ${chartData.totals.expense.toFixed(0)}
                            </p>
                            <p className="text-xs text-gray-600">Total</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      {chartData.expenseByCategory.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="flex-1">{item.name}</span>
                          <span className="font-medium">${item.value.toFixed(2)}</span>
                          <span className="text-gray-500 text-xs">({item.percentage.toFixed(1)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default TrackerMain