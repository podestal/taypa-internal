import useGetDishesByCategory from "../../hooks/api/dish/useGetDishesByCategory"
import useAuthStore from "../../store/useAuthStore"

const DishesMain = () => {
  const access = useAuthStore(state => state.access) || ''
  const { data: dishes, isLoading, isError, error, isSuccess} = useGetDishesByCategory({ access, categoryId: 1 })

  if (isLoading) return <p className="text-center text-gray-500 text-xs my-6 animate-pulse">Cargando...</p>
  if (isError) return <p className="text-center text-red-500 text-xs my-6">Error: {error?.message}</p>
  if (isSuccess)
  return (
    <div>
      <>{console.log('dishes',dishes)}</>
    </div>
  )
}

export default DishesMain