import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getDishService, { type Dish } from "../../../services/api/dishService"

interface DeleteDishData {
    access: string
}

interface Props {
    dishId: number
}

const useDeleteDish = ({ dishId }: Props): UseMutationResult<Dish, Error, DeleteDishData> => {
    const dishService = getDishService({ dishId })
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: (data: DeleteDishData) => dishService.delete(data.access) as Promise<Dish>,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dishes'] })
        },
        onError: (error) => {
            console.error('Error deleting dish:', error)
        }
    })
}

export default useDeleteDish

