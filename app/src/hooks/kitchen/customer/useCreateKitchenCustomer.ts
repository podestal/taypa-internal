import { useMutation, type UseMutationResult } from "@tanstack/react-query"
import getKitchenCustomerService, {
    type CreateKitchenCustomer,
    type KitchenCustomer,
} from "../../../services/kitchen/customerService"

interface CreateCustomerData {
    customer: CreateKitchenCustomer
    access: string
}

const useCreateKitchenCustomer = (): UseMutationResult<KitchenCustomer, Error, CreateCustomerData> => {
    const service = getKitchenCustomerService()
    return useMutation({
        mutationFn: (data: CreateCustomerData) => service.post(data.customer, data.access),
    })
}

export default useCreateKitchenCustomer
