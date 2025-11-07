import { motion } from 'framer-motion'

const TrackerCharts = () => {
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
  )
}

export default TrackerCharts