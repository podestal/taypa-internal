import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getAddressService, { type Address, type CreateUpdateAddress } from "../../../services/api/addressService"

interface UpdateAddressData {
    access: string
    address: CreateUpdateAddress
}

interface Props {
    addressId: number
    customerId: number
}

const useUpdateAddress = ({ addressId, customerId }: Props): UseMutationResult<Address, Error, UpdateAddressData> => {
    const queryClient = useQueryClient()
    const addressService = getAddressService({ addressId })
    return useMutation({
        mutationFn: (data: UpdateAddressData) => addressService.update(data.address, data.access),
        onSuccess: res => {
            console.log(res)
            queryClient.invalidateQueries({ queryKey: ['addresses', customerId] })
        },
        onError: (error) => {
            console.error(error)
        }
    })
}

export default useUpdateAddress