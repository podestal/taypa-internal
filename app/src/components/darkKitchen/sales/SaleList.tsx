import type { Sale } from '../../../services/kitchen/saleService'
import type { KitchenAccount } from '../../../services/kitchen/accountService'
import SaleCard from './SaleCard'

interface Props {
    sales: Sale[]
    accounts: KitchenAccount[]
    onCancel?: (sale: Sale) => void
    cancellingSaleId?: number | null
}

const SaleList = ({ sales, accounts, onCancel, cancellingSaleId }: Props) => {
    if (sales.length === 0) {
        return (
            <div className="text-center text-gray-500 py-12 bg-white rounded-lg border border-gray-200">
                <p>No hay ventas registradas</p>
                <p className="text-sm mt-1">Registra una venta usando el formulario de arriba</p>
            </div>
        )
    }

    const sorted = [...sales].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((sale, index) => (
                <SaleCard
                    key={sale.id}
                    sale={sale}
                    accounts={accounts}
                    index={index}
                    onCancel={onCancel}
                    isCancelling={cancellingSaleId === sale.id}
                />
            ))}
        </div>
    )
}

export default SaleList
