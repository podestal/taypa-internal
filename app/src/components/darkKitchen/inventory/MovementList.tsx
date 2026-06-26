import { Loader2 } from 'lucide-react'
import type { InventoryMovement } from '../../../services/kitchen/inventoryService'
import type { Product } from '../../../services/kitchen/productService'
import { sortMovementsDesc } from '../../../utils/inventoryHelpers'
import MovementCard from './MovementCard'

interface Props {
    movements: InventoryMovement[]
    products: Product[]
    isLoading: boolean
    error?: Error | null
}

const MovementList = ({ movements, products, isLoading, error }: Props) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16 bg-white rounded-lg border border-gray-200">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-12 bg-white rounded-lg border border-gray-200">
                Error al cargar movimientos: {error.message}
            </div>
        )
    }

    const sorted = sortMovementsDesc(movements)

    if (sorted.length === 0) {
        return (
            <div className="text-center text-gray-500 py-10 bg-white rounded-lg border border-gray-200">
                <p>No hay movimientos para los filtros seleccionados</p>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {sorted.map((movement, index) => (
                <MovementCard
                    key={movement.id}
                    movement={movement}
                    products={products}
                    index={index}
                />
            ))}
        </div>
    )
}

export default MovementList
