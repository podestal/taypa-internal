import { useState } from 'react'
import { motion } from 'framer-motion'
import TrackerTable from './TrackerTable'
import TrackerAddExpense from './TrackerAddExpense'
import TrackerAddIncome from './TrackerAddIncome'
import TrackerTransactions from './TrackerTransactions'

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

const Categories = [
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

const TrackerMain = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)



  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rastreador de Dinero</h1>
          <p className="text-gray-600">Gestiona los ingresos y gastos de tu restaurante</p>
        </motion.div>

        {/* Add Transaction Button */}
        <TrackerTransactions transactions={transactions} setTransactions={setTransactions} />

        {/* Form */}
        
        <TrackerTable transactions={transactions} categories={Categories as Category[]} />
      </div>
    </div>
  )
}

export default TrackerMain