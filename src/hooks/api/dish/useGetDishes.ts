import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getDishService, { type Dish } from "../../../services/api/dishService"

interface Props {
    access: string
}

const useGetDishes = ({ access }: Props): UseQueryResult<Dish[], Error> => {
    const dishService = getDishService({})
    return useQuery({
        queryKey: ['dishes'],
        queryFn: () => dishService.get(access) as Promise<Dish[]>,
    })
}

export default useGetDishes

