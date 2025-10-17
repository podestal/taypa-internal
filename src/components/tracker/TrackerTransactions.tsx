import { useState } from "react"
import TrackerAddExpense from "./TrackerAddExpense"
import TrackerAddIncome from "./TrackerAddIncome"
import type { Category, Transaction } from "./TrackerMain"
import { motion } from "framer-motion"


interface Props {
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
  categories: Category[]
}
const TrackerTransactions = ({ transactions, setTransactions, categories }: Props) => {

    const [transactionType, setTransactionType] = useState<'e' | 'i' | 'n'>('n')
    const [showForm, setShowForm] = useState(false)
  return (
    <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay: 0.2 }} 
    className="my-4 w-full flex justify-center">

        {transactionType === 'e' && (
            <TrackerAddExpense categories={categories} transactions={transactions} setTransactions={setTransactions} setTransactionType={setTransactionType} showForm={showForm} setShowForm={setShowForm} />
        )}
        {transactionType === 'i' && (
            <TrackerAddIncome categories={categories} transactions={transactions} setTransactions={setTransactions} setTransactionType={setTransactionType} showForm={showForm} setShowForm={setShowForm} />
        )}
        {transactionType === 'n' && (
            <div className="flex gap-10">
                <TrackerAddExpense categories={categories} transactions={transactions} setTransactions={setTransactions} setTransactionType={setTransactionType} showForm={showForm} setShowForm={setShowForm} />
                <TrackerAddIncome categories={categories} transactions={transactions} setTransactions={setTransactions} setTransactionType={setTransactionType} showForm={showForm} setShowForm={setShowForm} />
            </div>
        )}
    </motion.div>
  )
}

export default TrackerTransactions