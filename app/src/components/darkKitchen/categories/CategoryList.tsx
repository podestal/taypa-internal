import type { KitchenCategory } from '../../../services/kitchen/categoryService'
import CategoryCard from './CategoryCard'

interface Props {
    categories: KitchenCategory[]
    onEdit?: (category: KitchenCategory) => void
    onDeactivate?: (category: KitchenCategory) => void
    deactivatingCategoryId?: number | null
}

const CategoryList = ({ categories, onEdit, onDeactivate, deactivatingCategoryId }: Props) => {
    if (categories.length === 0) {
        return (
            <div className="text-center text-gray-500 py-12 bg-white rounded-lg border border-gray-200">
                <p>No hay categorías registradas</p>
                <p className="text-sm mt-1">Crea una categoría usando el formulario de arriba</p>
            </div>
        )
    }

    const activeCategories = categories.filter(c => c.is_active)
    const inactiveCategories = categories.filter(c => !c.is_active)

    return (
        <div className="space-y-6">
            {activeCategories.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeCategories.map((category, index) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            index={index}
                            onEdit={onEdit}
                            onDeactivate={onDeactivate}
                            isDeactivating={deactivatingCategoryId === category.id}
                        />
                    ))}
                </div>
            )}

            {inactiveCategories.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-500">Categorías inactivas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {inactiveCategories.map((category, index) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
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

export default CategoryList
