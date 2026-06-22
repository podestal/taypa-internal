import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getPurchaseService, { type Purchase } from "../../../services/kitchen/purchaseService"
import { normalizePurchases } from "../../../utils/purchaseHelpers"

interface Props {
    access: string
}

const useGetPurchases = ({ access }: Props): UseQueryResult<Purchase[], Error> => {
    const purchaseService = getPurchaseService()
    return useQuery({
        queryKey: ['purchases'],
        queryFn: async () => {
            const data = await purchaseService.get(access)
            return normalizePurchases(data)
        },
        retry: false,
    })
}

export default useGetPurchases
