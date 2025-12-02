import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { Category } from './TrackerMain'
import type { Transaction } from '../../services/api/transactionService'
import moment from 'moment'

interface Props {
  categories: Category[]
  transactions: Transaction[]
  isLoading: boolean
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

const TrackerCharts = ({ categories, transactions, isLoading }: Props) => {
  // Format currency helper
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(value)
  }

  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        lineData: [],
        incomeByCategory: [],
        expenseByCategory: [],
        totals: { income: 0, expense: 0, net: 0 },
        monthlyData: []
      }
    }

    // Group by date
    const dateGroups = transactions.reduce((acc, t) => {
      const date = moment(t.transaction_date).format('YYYY-MM-DD')
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 }
      }
      // Ensure amount is a number - convert string to number if needed
      const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : Number(t.amount)
      if (isNaN(amount)) {
        console.warn('Invalid amount in transaction:', t)
        return acc
      }
      if (t.transaction_type === 'I') {
        acc[date].income = Number(acc[date].income) + amount
      } else {
        acc[date].expense = Number(acc[date].expense) + amount
      }
      return acc
    }, {} as Record<string, { date: string; income: number; expense: number }>)

    const sortedDates = Object.values(dateGroups).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    // Filter to current month only for monthly chart
    const now = moment()
    const currentMonth = now.month()
    const currentYear = now.year()
    const monthlyData = sortedDates.filter((d: { date: string; income: number; expense: number }) => {
      const date = moment(d.date)
      return date.month() === currentMonth && date.year() === currentYear
    })

    // Category breakdown
    const categoryIncome = transactions
      .filter(t => t.transaction_type === 'I')
      .reduce((acc, t) => {
        const cat = categories.find(c => c.id === t.category)
        if (cat) {
          // Ensure amount is a number - convert string to number if needed
          const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : Number(t.amount)
          if (isNaN(amount)) {
            console.warn('Invalid amount in transaction:', t)
            return acc
          }
          const currentValue = Number(acc[cat.name] || 0)
          acc[cat.name] = currentValue + amount
        }
        return acc
      }, {} as Record<string, number>)

    const categoryExpense = transactions
      .filter(t => t.transaction_type === 'E')
      .reduce((acc, t) => {
        const cat = categories.find(c => c.id === t.category)
        if (cat) {
          // Ensure amount is a number - convert string to number if needed
          const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : Number(t.amount)
          if (isNaN(amount)) {
            console.warn('Invalid amount in transaction:', t)
            return acc
          }
          const currentValue = Number(acc[cat.name] || 0)
          acc[cat.name] = currentValue + amount
        }
        return acc
      }, {} as Record<string, number>)

    // Calculate totals from ALL transactions, not just those with matching categories
    const totalIncome = transactions
      .filter(t => t.transaction_type === 'I')
      .reduce((sum, t) => {
        const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : Number(t.amount)
        return isNaN(amount) ? sum : Number(sum) + amount
      }, 0)
    
    const totalExpense = transactions
      .filter(t => t.transaction_type === 'E')
      .reduce((sum, t) => {
        const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : Number(t.amount)
        return isNaN(amount) ? sum : Number(sum) + amount
      }, 0)

    return {
      lineData: sortedDates.map(d => ({
        ...d,
        net: d.income - d.expense
      })),
      monthlyData: monthlyData.map((d: { date: string; income: number; expense: number }) => ({
        ...d,
        net: d.income - d.expense
      })),
      incomeByCategory: Object.entries(categoryIncome)
        .map(([name, value]) => ({
          name,
          value: Number(value.toFixed(2)),
          percentage: totalIncome > 0 ? (value / totalIncome) * 100 : 0
        }))
        .sort((a, b) => b.value - a.value),
      expenseByCategory: Object.entries(categoryExpense)
        .map(([name, value]) => ({
          name,
          value: Number(value.toFixed(2)),
          percentage: totalExpense > 0 ? (value / totalExpense) * 100 : 0
        }))
        .sort((a, b) => b.value - a.value),
      totals: {
        income: totalIncome,
        expense: totalExpense,
        net: totalIncome - totalExpense
      }
    }
  }, [transactions, categories])

  if (isLoading) {
    return (
      <motion.div
        key="charts"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-6"
      >
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 text-lg mt-4">Cargando gráficos...</p>
        </div>
      </motion.div>
    )
  }

  if (transactions.length === 0) {
    return (
      <motion.div
        key="charts"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-6"
      >
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 text-lg">No hay datos para mostrar</p>
          <p className="text-gray-400 text-sm mt-2">Los gráficos aparecerán cuando haya transacciones</p>
        </div>
      </motion.div>
    )
  }


  return (
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
          {formatCurrency(chartData.totals.income)}
        </p>
      </div>
      <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
        <p className="text-sm text-red-700 font-medium mb-1">Total Gastos</p>
        <p className="text-2xl font-bold text-red-900">
          {formatCurrency(chartData.totals.expense)}
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
          {formatCurrency(chartData.totals.net)}
        </p>
      </div>
    </div>

    {/* Income vs Expenses Line Chart */}
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos vs Gastos</h3>
      {chartData.lineData.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData.lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => moment(value).format('DD/MM')}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: number | string) => {
                const numValue = typeof value === 'number' ? value : parseFloat(String(value))
                return formatCurrency(numValue)
              }}
              labelFormatter={(value) => moment(value).format('DD/MM/YYYY')}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
              name="Ingresos" 
            />
            <Line 
              type="monotone" 
              dataKey="expense" 
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ fill: '#ef4444', r: 4 }}
              activeDot={{ r: 6 }}
              name="Gastos" 
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay datos para mostrar</p>
        </div>
      )}
    </div>

    {/* Net Profit Trend - Current Month Only */}
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Ganancia Neta por Fecha - {moment().format('MMMM YYYY')}
      </h3>
      {chartData.monthlyData.length > 0 ? (
        <div className="h-64 flex items-end gap-2">
          {chartData.monthlyData.map((item, index) => {
            const maxNet = Math.max(...chartData.monthlyData.map(d => Math.abs(d.net)))
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
                    {moment(item.date).format('DD/MM')}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay datos para el mes actual</p>
        </div>
      )}
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
                <span className="text-green-600 font-bold">{formatCurrency(item.value)}</span>
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
                <span className="text-red-600 font-bold">{formatCurrency(item.value)}</span>
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
                  {formatCurrency(chartData.totals.income)}
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
              <span className="font-medium">{formatCurrency(item.value)}</span>
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
                  {formatCurrency(chartData.totals.expense)}
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
              <span className="font-medium">{formatCurrency(item.value)}</span>
              <span className="text-gray-500 text-xs">({item.percentage.toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
  )
}

export default TrackerCharts