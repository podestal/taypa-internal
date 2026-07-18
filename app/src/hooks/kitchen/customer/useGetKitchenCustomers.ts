import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { getKitchenCustomersService, type KitchenCustomer } from "../../../services/kitchen/customerService"
import { normalizeKitchenCustomers } from "../../../utils/customerHelpers"

interface Props {
    access: string
}

const useGetKitchenCustomers = ({ access }: Props): UseQueryResult<KitchenCustomer[], Error> => {
    const service = getKitchenCustomersService()
    return useQuery({
        queryKey: ['kitchen-customers'],
        queryFn: async () => normalizeKitchenCustomers(await service.get(access)),
        enabled: Boolean(access),
        retry: false,
    })
}

export default useGetKitchenCustomers
