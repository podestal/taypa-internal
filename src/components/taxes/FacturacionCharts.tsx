import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts'
import type { SunatDocument } from '../../utils/sunatHelpers'
import moment from 'moment'

interface Props {
  documents: SunatDocument[]
  isLoading: boolean
  selectedYear?: number
}

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4']

const FacturacionCharts = ({ documents, isLoading, selectedYear }: Props) => {
  // Chart data: Documents by type
  const documentsByType = useMemo(() => {
    const boletas = documents.filter(doc => {
      const tipo = doc.serie.startsWith('B') ? 'boleta' : doc.serie.startsWith('F') ? 'factura' : doc.tipo_documento
      return tipo === 'boleta'
    }).length
    
    const facturas = documents.filter(doc => {
      const tipo = doc.serie.startsWith('B') ? 'boleta' : doc.serie.startsWith('F') ? 'factura' : doc.tipo_documento
      return tipo === 'factura'
    }).length

    return [
      { name: 'Boletas', value: boletas, amount: documents.filter(doc => {
        const tipo = doc.serie.startsWith('B') ? 'boleta' : doc.serie.startsWith('F') ? 'factura' : doc.tipo_documento
        return tipo === 'boleta'
      }).reduce((sum, doc) => sum + doc.total, 0) },
      { name: 'Facturas', value: facturas, amount: documents.filter(doc => {
        const tipo = doc.serie.startsWith('B') ? 'boleta' : doc.serie.startsWith('F') ? 'factura' : doc.tipo_documento
        return tipo === 'factura'
      }).reduce((sum, doc) => sum + doc.total, 0) }
    ]
  }, [documents])

  // Chart data: Documents by status
  const documentsByStatus = useMemo(() => {
    const statusCount: Record<string, { count: number; amount: number }> = {}
    
    documents.forEach(doc => {
      const status = doc.estado
      if (!statusCount[status]) {
        statusCount[status] = { count: 0, amount: 0 }
      }
      statusCount[status].count++
      statusCount[status].amount += doc.total
    })

    return Object.entries(statusCount).map(([status, data]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      cantidad: data.count,
      monto: data.amount
    }))
  }, [documents])

  // Chart data: Documents by day
  const documentsByDay = useMemo(() => {
    const dayData: Record<string, { count: number; amount: number }> = {}
    
    documents.forEach(doc => {
      const day = moment(doc.created_at).format('DD/MM')
      if (!dayData[day]) {
        dayData[day] = { count: 0, amount: 0 }
      }
      dayData[day].count++
      dayData[day].amount += doc.total
    })

    return Object.entries(dayData)
      .sort(([a], [b]) => moment(a, 'DD/MM').valueOf() - moment(b, 'DD/MM').valueOf())
      .map(([day, data]) => ({
        fecha: day,
        cantidad: data.count,
        monto: data.amount
      }))
  }, [documents])

  // Chart data: Documents by month
  const documentsByMonth = useMemo(() => {
    const monthData: Record<string, { count: number; amount: number }> = {}
    
    documents.forEach(doc => {
      const month = moment(doc.created_at).format('MMM YYYY')
      if (!monthData[month]) {
        monthData[month] = { count: 0, amount: 0 }
      }
      monthData[month].count++
      monthData[month].amount += doc.total
    })

    return Object.entries(monthData)
      .sort(([a], [b]) => moment(a, 'MMM YYYY').valueOf() - moment(b, 'MMM YYYY').valueOf())
      .map(([month, data]) => ({
        mes: month,
        cantidad: data.count,
        monto: data.amount
      }))
  }, [documents])

  // Chart data: Documents by month for the year (for line chart)
  const documentsByMonthYear = useMemo(() => {
    const year = selectedYear || new Date().getFullYear()
    const monthData: Record<number, { count: number; amount: number }> = {}
    
    // Initialize all months with 0
    for (let i = 0; i < 12; i++) {
      monthData[i] = { count: 0, amount: 0 }
    }
    
    documents.forEach(doc => {
      const docDate = moment(doc.created_at)
      if (docDate.year() === year) {
        const month = docDate.month() // 0-11
        monthData[month].count++
        monthData[month].amount += doc.total
      }
    })

    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    
    return Object.entries(monthData)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([month, data]) => ({
        mes: monthNames[parseInt(month)],
        cantidad: data.count,
        monto: data.amount
      }))
  }, [documents, selectedYear])

  // Chart data: Amount by type
  const amountByType = useMemo(() => {
    const boletasAmount = documents
      .filter(doc => {
        const tipo = doc.serie.startsWith('B') ? 'boleta' : doc.serie.startsWith('F') ? 'factura' : doc.tipo_documento
        return tipo === 'boleta'
      })
      .reduce((sum, doc) => sum + doc.total, 0)
    
    const facturasAmount = documents
      .filter(doc => {
        const tipo = doc.serie.startsWith('B') ? 'boleta' : doc.serie.startsWith('F') ? 'factura' : doc.tipo_documento
        return tipo === 'factura'
      })
      .reduce((sum, doc) => sum + doc.total, 0)

    return [
      { name: 'Boletas', monto: boletasAmount },
      { name: 'Facturas', monto: facturasAmount }
    ]
  }, [documents])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0
    }).format(value)
  }

  if (isLoading) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-500 text-lg mt-4">Cargando gráficos...</p>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <p className="text-gray-500 text-lg">No hay datos para mostrar</p>
        <p className="text-gray-400 text-sm mt-2">Los gráficos aparecerán cuando haya documentos</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documents by Type - Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={documentsByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {documentsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Documents by Status - Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={documentsByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => value.toFixed(0)} />
              <Legend />
              <Bar dataKey="cantidad" fill="#3b82f6" name="Cantidad" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Documents by Day - Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-md lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos por Día</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={documentsByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'monto') return formatCurrency(value)
                  return value
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="cantidad" fill="#3b82f6" name="Cantidad" />
              <Bar yAxisId="right" dataKey="monto" fill="#8b5cf6" name="Monto (S/)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Amount by Type - Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monto por Tipo de Documento</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={amountByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="monto" fill="#8b5cf6" name="Monto (S/)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Documents by Month - Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia Mensual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={documentsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'monto') return formatCurrency(value)
                  return value
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="cantidad" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Cantidad" />
              <Area type="monotone" dataKey="monto" stackId="2" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Monto (S/)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Documents by Status - Amount Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg p-6 shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monto por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={documentsByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="monto" fill="#f59e0b" name="Monto (S/)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Yearly Trend - Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg p-6 shadow-md lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tendencia Anual {selectedYear || new Date().getFullYear()} - Documentos y Montos Declarados
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={documentsByMonthYear}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'monto') return formatCurrency(value)
                  return value
                }}
              />
              <Legend />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="cantidad" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                name="Cantidad de Documentos" 
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="monto" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 4 }}
                activeDot={{ r: 6 }}
                name="Monto Declarado (S/)" 
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}

export default FacturacionCharts

