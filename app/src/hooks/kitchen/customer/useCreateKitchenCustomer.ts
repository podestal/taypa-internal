import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
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
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateCustomerData) => service.post(data.customer, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchen-customers'] })
        },
    })
}

export default useCreateKitchenCustomer
