import { motion } from "framer-motion"
import { Minus } from "lucide-react"
import type { Category, Transaction } from "./TrackerMain"
import TrackerTransactionForm from "./TrackerTransactionForm"
import Modal from "../ui/Modal"

interface Props {
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
  showModal: boolean
  setShowModal: (show: boolean) => void
  categories: Category[]
}

const TrackerAddExpense = ({ transactions, setTransactions, showModal, setShowModal, categories }: Props) => {
  return (
    <>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => setShowModal(true)}
        className="bg-red-600 hover:bg-red-700 flex items-center justify-center gap-1.5 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-md transition-colors cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Minus size={16} />
        <span className="hidden sm:inline">Agregar Gasto</span>
        <span className="sm:hidden">Gasto</span>
      </motion.button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} width="max-w-lg">
        <TrackerTransactionForm 
          transactions={transactions} 
          setTransactions={setTransactions}
          categories={categories} 
          transactionType="e"
          onClose={() => setShowModal(false)}
        />
      </Modal>
    </>
  )
}

export default TrackerAddExpense