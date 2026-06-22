import type { KitchenAccount } from '../../../services/kitchen/accountService'
import AccountCard from './AccountCard'

interface Props {
    accounts: KitchenAccount[]
    onDeactivate?: (account: KitchenAccount) => void
    deactivatingAccountId?: number | null
}

const AccountList = ({ accounts, onDeactivate, deactivatingAccountId }: Props) => {
    if (accounts.length === 0) {
        return (
            <div className="text-center text-gray-500 py-12 bg-white rounded-lg border border-gray-200">
                <p>No hay cuentas registradas</p>
                <p className="text-sm mt-1">Crea una cuenta usando el formulario de arriba</p>
            </div>
        )
    }

    const activeAccounts = accounts.filter(a => a.is_active)
    const inactiveAccounts = accounts.filter(a => !a.is_active)

    return (
        <div className="space-y-6">
            {activeAccounts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeAccounts.map((account, index) => (
                        <AccountCard
                            key={account.id}
                            account={account}
                            index={index}
                            onDeactivate={onDeactivate}
                            isDeactivating={deactivatingAccountId === account.id}
                        />
                    ))}
                </div>
            )}

            {inactiveAccounts.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-500">Cuentas inactivas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {inactiveAccounts.map((account, index) => (
                            <AccountCard
                                key={account.id}
                                account={account}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default AccountList
