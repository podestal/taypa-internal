import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import TrackerTransactionForm from "./TrackerTransactionForm"
import type { Category, Transaction } from "./TrackerMain"

interface Props {
    transactions: Transaction[]
    setTransactions: (transactions: Transaction[]) => void
    setTransactionType: (transactionType: 'e' | 'i' | 'n') => void
    showForm: boolean
    setShowForm: (showForm: boolean) => void
    categories: Category[]
}


const TrackerAddIncome = ({ transactions, setTransactions, setTransactionType, showForm, setShowForm, categories }: Props) => {

  return (
    <div className="flex flex-col gap-2 w-full">
    <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => {
            setShowForm(true)
            setTransactionType('i')
        }}
        className="bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg font-medium shadow-lg transition-colors text-xs cursor-pointer"
    >
        <Plus size={16} />
            <span className="text-xs">Ingreso</span>
        </motion.button>
    {showForm && (
        <TrackerTransactionForm categories={categories} transactionType='i' setTransactionType={setTransactionType} transactions={transactions} setTransactions={setTransactions} showForm={showForm} setShowForm={setShowForm} />
    )}
    </div>
    
  )
}

export default TrackerAddIncome
