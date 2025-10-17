import { motion } from "framer-motion"
import { Minus } from "lucide-react"
import type { Transaction } from "./TrackerMain";
import { useState } from "react";
import TrackerTransactionForm from "./TrackerTransactionForm";

interface Props {
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
}

const TrackerAddExpense = ({ transactions, setTransactions }: Props) => {

    const [showForm, setShowForm] = useState(false)
  return (
    <>
        <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    onClick={() => setShowForm(true)}
    className="bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg font-medium shadow-lg transition-colors text-xs cursor-pointer"
    >
      <Minus size={16} />
      <span className="text-xs">Agregar Gasto</span>
    </motion.button>
    {showForm && (
        <TrackerTransactionForm transactions={transactions} setTransactions={setTransactions} showForm={showForm} setShowForm={setShowForm} />
    )}
    </>
  );
};

export default TrackerAddExpense;