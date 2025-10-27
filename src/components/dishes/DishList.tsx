import useAuthStore from "../../store/useAuthStore"
import useGetDishesByCategory from "../../hooks/api/dish/useGetDishesByCategory"
import DishCard from "./DishCard"

interface Props {
    categoryId: number
}

const DishList = ({ categoryId }: Props) => {

    const access = useAuthStore(state => state.access) || ''
    const { data: dishes, isLoading, isError, error, isSuccess} = useGetDishesByCategory({ access, categoryId })
  
    if (isLoading) return <p className="text-center text-gray-500 text-xs my-6 animate-pulse">Cargando...</p>
    if (isError) return <p className="text-center text-red-500 text-xs my-6">Error: {error?.message}</p>
    if (isSuccess)
  return (
    <div className="grid grid-cols-1 gap-2">
        {dishes?.map((dish, index) => (
            <DishCard key={dish.id} dish={dish} index={index} />
        ))}
    </div>
  )
}

export default DishList