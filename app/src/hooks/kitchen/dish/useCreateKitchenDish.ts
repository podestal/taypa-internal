import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getKitchenDishService, { type KitchenDish, type CreateKitchenDish } from "../../../services/kitchen/dishService"

interface CreateDishData {
    dish: CreateKitchenDish
    access: string
}

const useCreateKitchenDish = (): UseMutationResult<KitchenDish, Error, CreateDishData> => {
    const dishService = getKitchenDishService()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateDishData) => dishService.post(data.dish, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchen-dishes'] })
        },
        onError: (error) => {
            console.error('Error creating kitchen dish:', error)
        },
    })
}

export default useCreateKitchenDish
