import { motion } from "framer-motion"
import type { Category } from "../../services/api/categoryService"
import { CupSoda, Drumstick, Hamburger, Salad } from "lucide-react"

interface Props {
    category: Category
    setSelectedCategory: React.Dispatch<React.SetStateAction<number>>
    selectedCategory: number
    idx: number
}

const categoryIcons = [
    <Drumstick />,
    <Hamburger />,
    <Salad />,
    <CupSoda />
]

const CategoryCard = ({ category, setSelectedCategory, selectedCategory, idx }: Props) => {
  return (
    <motion.button
        onClick={() => setSelectedCategory(category.id)}
        className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 ${
        selectedCategory === category.id
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-200 hover:border-gray-300 text-gray-700'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
    >
        <div className="flex items-center justify-center mb-2">
        {categoryIcons[idx]}
        </div>
        <div className="text-sm font-medium">{category.name}</div>
    </motion.button>
  )
}

export default CategoryCard