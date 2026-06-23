import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getKitchenCategoryService, { type KitchenCategory } from "../../../services/kitchen/categoryService"
import { normalizeKitchenCategories } from "../../../utils/categoryHelpers"

interface Props {
    access: string
}

const useGetKitchenCategories = ({ access }: Props): UseQueryResult<KitchenCategory[], Error> => {
    const categoryService = getKitchenCategoryService()
    return useQuery({
        queryKey: ['kitchen-categories'],
        queryFn: async () => {
            const data = await categoryService.get(access)
            return normalizeKitchenCategories(data)
        },
        retry: false,
    })
}

export default useGetKitchenCategories
