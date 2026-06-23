import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getSaleService, { type Sale } from "../../../services/kitchen/saleService"
import { normalizeSale } from "../../../utils/saleHelpers"

interface Props {
    access: string
    saleId: number
    enabled?: boolean
}

const useGetSale = ({ access, saleId, enabled = true }: Props): UseQueryResult<Sale, Error> => {
    const saleService = getSaleService({ saleId })
    return useQuery({
        queryKey: ['sales', saleId],
        queryFn: async () => {
            const data = await saleService.get(access)
            return normalizeSale(data)
        },
        enabled: enabled && saleId > 0,
        retry: false,
    })
}

export default useGetSale
