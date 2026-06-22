import type { Category } from "../../services/api/categoryService"
import CategoryCard from "./CategoryCard"

interface Props {
    categories: Category[]
    setSelectedCategory: React.Dispatch<React.SetStateAction<number>>
    selectedCategory: number
}


const CategoryList = ({ categories, setSelectedCategory, selectedCategory }: Props) => {
  return (
    <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Seleccionar Categoría</h3>
        <div className="grid grid-cols-2 gap-3">
            {categories
            .filter((category) => category.is_menu_category)
            .map((category, idx) => (
                <CategoryCard key={category.id} category={category} setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} idx={idx} />
            ))}
        </div>
    </div>
  )
}

export default CategoryList