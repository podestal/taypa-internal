import { motion } from 'framer-motion'
import { Trash2, Wallet } from 'lucide-react'
import type { KitchenAccount } from '../../../services/kitchen/accountService'
import { formatDecimal } from '../../../utils/inventoryHelpers'

interface Props {
    account: KitchenAccount
    index: number
    onDeactivate?: (account: KitchenAccount) => void
    isDeactivating?: boolean
}

const AccountCard = ({ account, index, onDeactivate, isDeactivating }: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-lg shadow-md p-5 border hover:shadow-lg transition-shadow ${
                account.is_active ? 'border-gray-200' : 'border-gray-200 opacity-60'
            }`}
        >
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${account.is_active ? 'bg-emerald-50' : 'bg-gray-100'}`}>
                    <Wallet className={`w-5 h-5 ${account.is_active ? 'text-emerald-600' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{account.name}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                            account.is_active
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-600'
                        }`}>
                            {account.is_active ? 'Activa' : 'Inactiva'}
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                        S/ {formatDecimal(account.balance)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Saldo disponible</p>
                </div>
            </div>

            {account.is_active && onDeactivate && (
                <motion.button
                    onClick={() => onDeactivate(account)}
                    disabled={isDeactivating}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <Trash2 className="w-4 h-4" />
                    <span>{isDeactivating ? 'Desactivando...' : 'Desactivar cuenta'}</span>
                </motion.button>
            )}
        </motion.div>
    )
}

export default AccountCard
