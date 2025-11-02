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
    const [showExpenseModal, setShowExpenseModal] = useState(false)
    const [showIncomeModal, setShowIncomeModal] = useState(false)

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }} 
        className="w-full flex justify-center gap-4"
      >
        <TrackerAddExpense 
          categories={categories} 
          transactions={transactions} 
          setTransactions={setTransactions}
          showModal={showExpenseModal}
          setShowModal={setShowExpenseModal}
        />
        <TrackerAddIncome 
          categories={categories} 
          transactions={transactions} 
          setTransactions={setTransactions}
          showModal={showIncomeModal}
          setShowModal={setShowIncomeModal}
        />
      </motion.div>
    </>
  )
}

export default TrackerTransactions