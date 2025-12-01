import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getDishService, { type Dish, type CreateUpdateDish } from "../../../services/api/dishService"

interface UpdateDishData {
    dish: CreateUpdateDish
    access: string
}

interface Props {
    dishId: number
}

const useUpdateDish = ({ dishId }: Props): UseMutationResult<Dish, Error, UpdateDishData> => {
    const dishService = getDishService({ dishId })
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: (data: UpdateDishData) => dishService.update(data.dish, data.access) as Promise<Dish>,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dishes'] })
        },
        onError: (error) => {
            console.error('Error updating dish:', error)
        }
    })
}

export default useUpdateDish

