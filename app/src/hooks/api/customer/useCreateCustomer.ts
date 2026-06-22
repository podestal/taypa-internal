import { useMutation, type UseMutationResult } from "@tanstack/react-query"
import getCustomerService, { type Customer, type CreateUpdateCustomer } from "../../../services/api/customerService"

export interface CreateCustomerData {
    customer: CreateUpdateCustomer
    access: string
}

const useCreateCustomer = (): UseMutationResult<Customer, Error, CreateCustomerData> => {
    const customerService = getCustomerService({})
    console.log('useCreateCustomer');
    
    return useMutation({
        mutationFn: (data: CreateCustomerData) => customerService.post(data.customer, data.access),
        onSuccess: (data) => console.log(data),
        onError: (error) => console.error(error)
    })
}

export default useCreateCustomer