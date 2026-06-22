import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getAddressService, { type Address, type CreateUpdateAddress } from "../../../services/api/addressService"

export interface CreateAddressData {
    address: CreateUpdateAddress
    access: string
}

interface Props {
    customerId: number
}

const useCreateAddress = ({ customerId }: Props): UseMutationResult<Address, Error, CreateAddressData> => {
    const queryClient = useQueryClient()
    const addressService = getAddressService({})
    return useMutation({
        mutationFn: (data: CreateAddressData) => addressService.post(data.address, data.access),
        onSuccess: res => {
            console.log(res)
            queryClient.invalidateQueries({ queryKey: ['addresses', customerId] })
        },
        onError: (error) => console.error(error)
    })
}

export default useCreateAddress