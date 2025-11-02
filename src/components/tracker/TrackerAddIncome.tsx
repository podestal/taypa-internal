import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import TrackerTransactionForm from "./TrackerTransactionForm"
import type { Category, Transaction } from "./TrackerMain"
import Modal from "../ui/Modal"

interface Props {
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
  showModal: boolean
  setShowModal: (show: boolean) => void
  categories: Category[]
}

const TrackerAddIncome = ({ transactions, setTransactions, showModal, setShowModal, categories }: Props) => {
  return (
    <>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => setShowModal(true)}
        className="bg-green-600 hover:bg-green-700 flex items-center justify-center gap-1.5 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-md transition-colors cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus size={16} />
        <span className="hidden sm:inline">Agregar Ingreso</span>
        <span className="sm:hidden">Ingreso</span>
      </motion.button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} width="max-w-lg">
        <TrackerTransactionForm 
          transactions={transactions} 
          setTransactions={setTransactions}
          categories={categories} 
          transactionType="i"
          onClose={() => setShowModal(false)}
        />
      </Modal>
    </>
  )
}

export default TrackerAddIncome
