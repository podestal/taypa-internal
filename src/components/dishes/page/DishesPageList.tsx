import { motion } from 'framer-motion'
import DishesPageCard from './DishesPageCard'
import type { Dish } from '../../../services/api/dishService'
import type { Category } from '../../../services/api/categoryService'

interface Props {
  dishes: Dish[]
  categories: Category[]
  onEdit: (dish: Dish) => void
  onDelete: (dish: Dish) => void
  deletingDishId: number | null
}

const DishesPageList = ({ dishes, categories, onEdit, onDelete, deletingDishId }: Props) => {
  const getCategoryById = (categoryId: number) => {
    return categories.find(cat => cat.id === categoryId)
  }

  if (dishes.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12 bg-white rounded-lg border border-gray-200">
        <p>No hay platos disponibles</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dishes.map((dish, index) => (
        <DishesPageCard
          key={dish.id}
          dish={dish}
          index={index}
          category={getCategoryById(dish.category)}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={deletingDishId === dish.id}
        />
      ))}
    </div>
  )
}

export default DishesPageList

