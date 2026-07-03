import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getKitchenCategoryService, {
    type KitchenCategory,
    type KitchenCategoryListParams,
} from "../../../services/kitchen/categoryService"
import { normalizeKitchenCategories } from "../../../utils/categoryHelpers"

interface Props {
    access: string
    params?: KitchenCategoryListParams
    enabled?: boolean
}

const useGetKitchenCategories = ({
    access,
    params = {},
    enabled = true,
}: Props): UseQueryResult<KitchenCategory[], Error> => {
    const categoryService = getKitchenCategoryService()
    return useQuery({
        queryKey: ['kitchen-categories', params],
        queryFn: async () => {
            const queryParams = Object.fromEntries(
                Object.entries(params).filter(([, value]) => value != null && value !== '')
            ) as Record<string, string>
            const data = await categoryService.get(access, queryParams)
            return normalizeKitchenCategories(data)
        },
        enabled,
        retry: false,
    })
}

export default useGetKitchenCategories
