import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getToppingService, { type KitchenTopping, type CreateKitchenToppingPayload } from "../../../services/kitchen/toppingService"

interface CreateToppingData {
    topping: CreateKitchenToppingPayload
    access: string
}

const useCreateTopping = (): UseMutationResult<KitchenTopping, Error, CreateToppingData> => {
    const toppingService = getToppingService()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateToppingData) => toppingService.post(data.topping, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchen-toppings'] })
        },
        onError: (error) => {
            console.error('Error creating topping:', error)
        },
    })
}

export default useCreateTopping
