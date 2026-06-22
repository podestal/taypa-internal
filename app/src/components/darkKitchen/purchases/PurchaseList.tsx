import type { Purchase } from '../../../services/kitchen/purchaseService'
import type { Product } from '../../../services/kitchen/productService'
import type { KitchenAccount } from '../../../services/kitchen/accountService'
import PurchaseCard from './PurchaseCard'

interface Props {
    purchases: Purchase[]
    products: Product[]
    accounts: KitchenAccount[]
}

const PurchaseList = ({ purchases, products, accounts }: Props) => {
    if (purchases.length === 0) {
        return (
            <div className="text-center text-gray-500 py-12 bg-white rounded-lg border border-gray-200">
                <p>No hay compras registradas</p>
                <p className="text-sm mt-1">Registra una compra usando el formulario de arriba</p>
            </div>
        )
    }

    const sorted = [...purchases].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((purchase, index) => (
                <PurchaseCard
                    key={purchase.id}
                    purchase={purchase}
                    products={products}
                    accounts={accounts}
                    index={index}
                />
            ))}
        </div>
    )
}

export default PurchaseList
