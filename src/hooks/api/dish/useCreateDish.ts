import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getDishService, { type Dish, type CreateUpdateDish } from "../../../services/api/dishService"

interface CreateDishData {
    dish: CreateUpdateDish
    access: string
}

const useCreateDish = (): UseMutationResult<Dish, Error, CreateDishData> => {
    const dishService = getDishService({})
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: (data: CreateDishData) => dishService.post(data.dish, data.access) as Promise<Dish>,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dishes'] })
        },
        onError: (error) => {
            console.error('Error creating dish:', error)
        }
    })
}

export default useCreateDish

