import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getSaleService, { type Sale } from "../../../services/kitchen/saleService"
import { normalizeSales } from "../../../utils/saleHelpers"

interface Props {
    access: string
}

const useGetSales = ({ access }: Props): UseQueryResult<Sale[], Error> => {
    const saleService = getSaleService()
    return useQuery({
        queryKey: ['sales'],
        queryFn: async () => {
            const data = await saleService.get(access)
            return normalizeSales(data)
        },
        retry: false,
    })
}

export default useGetSales
