import type { KitchenDish } from '../../../services/kitchen/dishService'
import type { KitchenCategory } from '../../../services/kitchen/categoryService'
import type { Product } from '../../../services/kitchen/productService'
import DishCard from './DishCard'

interface Props {
    dishes: KitchenDish[]
    categories: KitchenCategory[]
    products: Product[]
    onEdit?: (dish: KitchenDish) => void
    onDeactivate?: (dish: KitchenDish) => void
    deactivatingDishId?: number | null
}

const DishList = ({ dishes, categories, products, onEdit, onDeactivate, deactivatingDishId }: Props) => {
    if (dishes.length === 0) {
        return (
            <div className="text-center text-gray-500 py-12 bg-white rounded-lg border border-gray-200">
                <p>No hay platos registrados</p>
                <p className="text-sm mt-1">Crea un plato usando el formulario de arriba</p>
            </div>
        )
    }

    const activeDishes = dishes.filter(d => d.is_active)
    const inactiveDishes = dishes.filter(d => !d.is_active)

    return (
        <div className="space-y-6">
            {activeDishes.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeDishes.map((dish, index) => (
                        <DishCard
                            key={dish.id}
                            dish={dish}
                            categories={categories}
                            products={products}
                            index={index}
                            onEdit={onEdit}
                            onDeactivate={onDeactivate}
                            isDeactivating={deactivatingDishId === dish.id}
                        />
                    ))}
                </div>
            )}

            {inactiveDishes.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-500">Platos inactivos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {inactiveDishes.map((dish, index) => (
                            <DishCard
                                key={dish.id}
                                dish={dish}
                                categories={categories}
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

export default DishList
