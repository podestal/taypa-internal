import useGetCategories from "../../hooks/api/category/useGetCategories"
import useAuthStore from "../../store/useAuthStore"
import CategoryList from "./CategoryList"

interface Props {
  setSelectedCategory: React.Dispatch<React.SetStateAction<number>>
  selectedCategory: number
}

const CategoriesMain = ({ setSelectedCategory, selectedCategory }: Props) => {
  const access = useAuthStore((state) => state.access) || ''
  const { data: categories, isLoading, error, isError, isSuccess } = useGetCategories({ access: access })

  if (isLoading) return <p className="text-center text-gray-500 text-xs my-6 animate-pulse">Cargando categorías...</p>
  if (isError) return <p className="text-center text-red-500 text-xs my-6">Error: {error?.message}</p>
  if (isSuccess) 

  return (
    <>
      <CategoryList categories={categories} setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} />
    </>
  )
}

export default CategoriesMain