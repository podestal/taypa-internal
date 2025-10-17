import { useState } from "react"
import TrackerAddExpense from "./TrackerAddExpense"
import TrackerAddIncome from "./TrackerAddIncome"
import type { Transaction } from "./TrackerMain"
import { motion } from "framer-motion"


interface Props {
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
}
const TrackerTransactions = ({ transactions, setTransactions }: Props) => {

    const [transactionType, setTransactionType] = useState<'e' | 'i' | 'n'>('n')
    const [showForm, setShowForm] = useState(false)
  return (
    <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay: 0.2 }} 
    className="">

        {transactionType === 'e' && (
            <TrackerAddExpense transactions={transactions} setTransactions={setTransactions} setTransactionType={setTransactionType} showForm={showForm} setShowForm={setShowForm} />
        )}
        {transactionType === 'i' && (
            <TrackerAddIncome transactions={transactions} setTransactions={setTransactions} setTransactionType={setTransactionType} showForm={showForm} setShowForm={setShowForm} />
        )}
        {transactionType === 'n' && (
            <div className="flex gap-4">
                <TrackerAddExpense transactions={transactions} setTransactions={setTransactions} setTransactionType={setTransactionType} showForm={showForm} setShowForm={setShowForm} />
                <TrackerAddIncome transactions={transactions} setTransactions={setTransactions} setTransactionType={setTransactionType} showForm={showForm} setShowForm={setShowForm} />
            </div>
        )}
    </motion.div>
  )
}

export default TrackerTransactions