import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getAddressService, { type Address } from "../../../services/api/addressService"

interface Props {
    access: string
    customerId: number
}

const useGetAddressesByCustomer = ({ access, customerId }: Props): UseQueryResult<Address[], Error> => {
    const addressService = getAddressService({byCustomer: true})
    const params: Record<string, string> = {
        customer_id: customerId.toString(),
    }
    return useQuery({
        queryKey: ['addresses', customerId],
        queryFn: () => addressService.get(access, params),
    })
}

export default useGetAddressesByCustomer
