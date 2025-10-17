import { motion } from "framer-motion"
import { Minus } from "lucide-react"
import type { Category, Transaction } from "./TrackerMain";
import TrackerTransactionForm from "./TrackerTransactionForm";

interface Props {
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
  setTransactionType: (transactionType: 'e' | 'i' | 'n') => void
  showForm: boolean
  setShowForm: (showForm: boolean) => void
  categories: Category[]
}

const TrackerAddExpense = ({ transactions, setTransactions, setTransactionType, showForm, setShowForm, categories }: Props) => {
  return (
    <div className="flex flex-col gap-2 w-full">
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => {
                setShowForm(true)
                setTransactionType('e')
            }}
            className="bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg font-medium shadow-lg transition-colors text-xs cursor-pointer"
            >
            <Minus size={16} />
            <span className="text-xs">Gasto</span>
    </motion.button>
    {showForm && (
        <TrackerTransactionForm setTransactionType={setTransactionType} transactions={transactions} setTransactions={setTransactions} showForm={showForm} setShowForm={setShowForm} categories={categories} transactionType='e' />
    )}
    </div>
  );
};

export default TrackerAddExpense;