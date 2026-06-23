import type { KitchenTopping } from '../../../services/kitchen/toppingService'
import type { Product } from '../../../services/kitchen/productService'
import ToppingCard from './ToppingCard'

interface Props {
    toppings: KitchenTopping[]
    products: Product[]
    onEdit?: (topping: KitchenTopping) => void
    onDeactivate?: (topping: KitchenTopping) => void
    deactivatingToppingId?: number | null
}

const ToppingList = ({ toppings, products, onEdit, onDeactivate, deactivatingToppingId }: Props) => {
    if (toppings.length === 0) {
        return (
            <div className="text-center text-gray-500 py-12 bg-white rounded-lg border border-gray-200">
                <p>No hay toppings registrados</p>
                <p className="text-sm mt-1">Crea un topping usando el formulario de arriba</p>
            </div>
        )
    }

    const activeToppings = toppings.filter(t => t.is_active)
    const inactiveToppings = toppings.filter(t => !t.is_active)

    return (
        <div className="space-y-6">
            {activeToppings.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeToppings.map((topping, index) => (
                        <ToppingCard
                            key={topping.id}
                            topping={topping}
                            products={products}
                            index={index}
                            onEdit={onEdit}
                            onDeactivate={onDeactivate}
                            isDeactivating={deactivatingToppingId === topping.id}
                        />
                    ))}
                </div>
            )}

            {inactiveToppings.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-500">Toppings inactivos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {inactiveToppings.map((topping, index) => (
                            <ToppingCard
                                key={topping.id}
                                topping={topping}
                                products={products}
                                index={index}
                                onEdit={onEdit}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ToppingList
