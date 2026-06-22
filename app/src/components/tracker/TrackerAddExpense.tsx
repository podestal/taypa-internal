import { motion } from "framer-motion"
import { Minus } from "lucide-react"
import TrackerTransactionForm from "./TrackerTransactionForm"
import Modal from "../ui/Modal"
import useCreateTransaction from "../../hooks/api/transaction/useCreateTransaction"

interface Props {
  showModal: boolean
  setShowModal: (show: boolean) => void
}

const TrackerAddExpense = ({ showModal, setShowModal }: Props) => {

  const createTransaction = useCreateTransaction()
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
          transactionType="E"
          onClose={() => setShowModal(false)}
          createTransaction={createTransaction}
        />
      </Modal>
    </>
  )
}

export default TrackerAddExpense