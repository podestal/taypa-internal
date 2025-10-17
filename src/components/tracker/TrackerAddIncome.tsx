import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { useState } from "react"
import TrackerTransactionForm from "./TrackerTransactionForm"
import type { Transaction } from "./TrackerMain"

interface Props {
    transactions: Transaction[]
    setTransactions: (transactions: Transaction[]) => void
}


const TrackerAddIncome = ({ transactions, setTransactions }: Props) => {

    const [showForm, setShowForm] = useState(false)
  return (
    <>
    <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => setShowForm(true)}
        className="bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg font-medium shadow-lg transition-colors text-xs cursor-pointer"
    >
        <Plus size={16} />
            <span className="text-xs">Agregar Ingreso</span>
        </motion.button>
    {showForm && (
        <TrackerTransactionForm transactions={transactions} setTransactions={setTransactions} showForm={showForm} setShowForm={setShowForm} />
    )}
    </>
    
  )
}

export default TrackerAddIncome
