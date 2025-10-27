import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getDishService, { type Dish } from "../../../services/api/dishService"

interface Props {
    access: string
    categoryId: number
}

const useGetDishesByCategory = ({ access, categoryId }: Props): UseQueryResult<Dish[], Error> => {

    const dishService = getDishService({ byCategory: true })
    const params: Record<string, string> = {
        category_id: categoryId.toString(),
    }
    return useQuery({
        queryKey: ['dishes', categoryId],
        queryFn: () => dishService.get(access, params),
    })
}

export default useGetDishesByCategory