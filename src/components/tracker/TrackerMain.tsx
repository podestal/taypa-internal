import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Table, BarChart3 } from 'lucide-react'
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
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'I' | 'E'>('all')
  const [activeTab, setActiveTab] = useState<'table' | 'charts'>('table')
  const [currentPage, setCurrentPage] = useState(1)

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
              <></>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default TrackerMain