import { useState } from "react"
import TrackerAddExpense from "./TrackerAddExpense"
import TrackerAddIncome from "./TrackerAddIncome"
import { motion } from "framer-motion"

const TrackerTransactions = () => {
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
          showModal={showExpenseModal}
          setShowModal={setShowExpenseModal}
        />
        <TrackerAddIncome 
          showModal={showIncomeModal}
          setShowModal={setShowIncomeModal}
        />
      </motion.div>
    </>
  )
}

export default TrackerTransactions