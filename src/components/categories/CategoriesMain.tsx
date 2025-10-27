import useGetCategories from "../../hooks/api/category/useGetCategories"
import useAuthStore from "../../store/useAuthStore"

const CategoriesMain = () => {
  const access = useAuthStore((state) => state.access) || ''
  const { data: categories, isLoading, error, isError, isSuccess } = useGetCategories({ access: access })

  if (isLoading) return <p className="text-center text-gray-500 text-xs my-6 animate-pulse">Cargando categorías...</p>
  if (isError) return <p className="text-center text-red-500 text-xs my-6">Error: {error?.message}</p>
  if (isSuccess) 

  return (
    <div>
      <>{console.log(categories)}</>
    </div>
  )
}

export default CategoriesMain