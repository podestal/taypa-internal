import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getProductService, { type Product, type ProductListParams } from "../../../services/kitchen/productService"
import { normalizeProducts } from "../../../utils/productHelpers"

interface Props {
    access: string
    params?: ProductListParams
    enabled?: boolean
}

const useGetProducts = ({
    access,
    params = {},
    enabled = true,
}: Props): UseQueryResult<Product[], Error> => {
    const productService = getProductService({})
    return useQuery({
        queryKey: ['products', params],
        queryFn: async () => {
            const queryParams = Object.fromEntries(
                Object.entries(params).filter(([, value]) => value != null && value !== '')
            ) as Record<string, string>
            const data = await productService.get(access, queryParams)
            return normalizeProducts(data)
        },
        enabled,
    })
}

export default useGetProducts
