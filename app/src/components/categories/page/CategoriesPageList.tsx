import { motion } from 'framer-motion'
import CategoriesPageCard from './CategoriesPageCard'
import type { Category } from '../../../services/api/categoryService'

interface Props {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  deletingCategoryId: number | null
}

const CategoriesPageList = ({ categories, onEdit, onDelete, deletingCategoryId }: Props) => {
  if (categories.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12 bg-white rounded-lg border border-gray-200">
        <p>No hay categorías en esta sección</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category, index) => (
        <CategoriesPageCard
          key={category.id}
          category={category}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={deletingCategoryId === category.id}
        />
      ))}
    </div>
  )
}

export default CategoriesPageList

