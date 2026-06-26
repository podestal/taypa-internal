import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getSaleService, { type Sale, type SaleListParams } from "../../../services/kitchen/saleService"
import { normalizeSales } from "../../../utils/saleHelpers"

interface Props {
    access: string
    params?: SaleListParams
    enabled?: boolean
}

const useGetSales = ({
    access,
    params = {},
    enabled = true,
}: Props): UseQueryResult<Sale[], Error> => {
    const saleService = getSaleService()
    return useQuery({
        queryKey: ['sales', params],
        queryFn: async () => {
            const queryParams = Object.fromEntries(
                Object.entries(params).filter(([, value]) => value != null && value !== '')
            ) as Record<string, string>
            const data = await saleService.get(access, queryParams)
            return normalizeSales(data)
        },
        enabled,
        retry: false,
    })
}

export default useGetSales
