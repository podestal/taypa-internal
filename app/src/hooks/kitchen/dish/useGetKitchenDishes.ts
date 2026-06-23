import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getKitchenDishService, { type KitchenDish } from "../../../services/kitchen/dishService"
import { normalizeKitchenDishes } from "../../../utils/dishHelpers"

interface Props {
    access: string
}

const useGetKitchenDishes = ({ access }: Props): UseQueryResult<KitchenDish[], Error> => {
    const dishService = getKitchenDishService()
    return useQuery({
        queryKey: ['kitchen-dishes'],
        queryFn: async () => {
            const data = await dishService.get(access)
            return normalizeKitchenDishes(data)
        },
        retry: false,
    })
}

export default useGetKitchenDishes
