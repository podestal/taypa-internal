import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getPurchaseService, { type Purchase, type PurchaseListParams } from "../../../services/kitchen/purchaseService"
import { normalizePurchases } from "../../../utils/purchaseHelpers"

interface Props {
    access: string
    params?: PurchaseListParams
    enabled?: boolean
}

const useGetPurchases = ({
    access,
    params = {},
    enabled = true,
}: Props): UseQueryResult<Purchase[], Error> => {
    const purchaseService = getPurchaseService()
    return useQuery({
        queryKey: ['purchases', params],
        queryFn: async () => {
            const queryParams = Object.fromEntries(
                Object.entries(params).filter(([, value]) => value != null && value !== '')
            ) as Record<string, string>
            const data = await purchaseService.get(access, queryParams)
            return normalizePurchases(data)
        },
        enabled,
        retry: false,
    })
}

export default useGetPurchases
