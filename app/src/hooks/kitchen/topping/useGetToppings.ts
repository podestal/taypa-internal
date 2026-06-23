import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getToppingService, { type KitchenTopping } from "../../../services/kitchen/toppingService"
import { normalizeToppings } from "../../../utils/toppingHelpers"

interface Props {
    access: string
}

const useGetToppings = ({ access }: Props): UseQueryResult<KitchenTopping[], Error> => {
    const toppingService = getToppingService()
    return useQuery({
        queryKey: ['kitchen-toppings'],
        queryFn: async () => {
            const data = await toppingService.get(access)
            return normalizeToppings(data)
        },
        retry: false,
    })
}

export default useGetToppings
