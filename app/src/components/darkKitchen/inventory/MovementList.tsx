import type { InventoryMovement } from '../../../services/kitchen/inventoryService'
import type { Product } from '../../../services/kitchen/productService'
import MovementCard from './MovementCard'

interface Props {
    movements: InventoryMovement[]
    products: Product[]
}

const MovementList = ({ movements, products }: Props) => {
    if (movements.length === 0) {
        return (
            <div className="text-center text-gray-500 py-10 bg-white rounded-lg border border-gray-200">
                <p>No hay movimientos registrados</p>
            </div>
        )
    }

    const sorted = [...movements].sort(
        (a, b) => new Date(b.movement_date).getTime() - new Date(a.movement_date).getTime()
    )

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
