import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getKitchenTransactionService, {
    type KitchenTransaction,
    type KitchenTransactionListParams,
} from "../../../services/kitchen/transactionService"
import { normalizeKitchenTransactions } from "../../../utils/transactionHelpers"

interface Props {
    access: string
    params?: KitchenTransactionListParams
    enabled?: boolean
}

const useGetKitchenTransactions = ({
    access,
    params = {},
    enabled = true,
}: Props): UseQueryResult<KitchenTransaction[], Error> => {
    const transactionService = getKitchenTransactionService()
    return useQuery({
        queryKey: ['kitchen-transactions', params],
        queryFn: async () => {
            const queryParams = Object.fromEntries(
                Object.entries(params).filter(([, value]) => value != null && value !== '')
            ) as Record<string, string>
            const data = await transactionService.get(access, queryParams)
            return normalizeKitchenTransactions(data)
        },
        enabled,
        retry: false,
    })
}

export default useGetKitchenTransactions
