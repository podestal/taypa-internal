import { useMutation, type UseMutationResult } from "@tanstack/react-query"
import getAddressService, { type Address, type CreateUpdateAddress } from "../../../services/api/addressService"

export interface CreateAddressData {
    address: CreateUpdateAddress
    access: string
}

const useCreateAddress = (): UseMutationResult<Address, Error, CreateAddressData> => {
    const addressService = getAddressService({})
    return useMutation({
        mutationFn: (data: CreateAddressData) => addressService.post(data.address, data.access),
        onSuccess: (data) => console.log(data),
        onError: (error) => console.error(error)
    })
}

export default useCreateAddress