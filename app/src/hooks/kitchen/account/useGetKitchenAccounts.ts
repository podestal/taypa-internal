import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getKitchenAccountService, { type KitchenAccount } from "../../../services/kitchen/accountService"
import { normalizeKitchenAccounts } from "../../../utils/accountHelpers"

interface Props {
    access: string
}

const useGetKitchenAccounts = ({ access }: Props): UseQueryResult<KitchenAccount[], Error> => {
    const accountService = getKitchenAccountService()
    return useQuery({
        queryKey: ['kitchen-accounts'],
        queryFn: async () => {
            const data = await accountService.get(access)
            return normalizeKitchenAccounts(data)
        },
        retry: false,
    })
}

export default useGetKitchenAccounts
