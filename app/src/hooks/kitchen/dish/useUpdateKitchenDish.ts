import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getKitchenDishService, { type KitchenDish, type UpdateKitchenDish } from "../../../services/kitchen/dishService"

interface UpdateDishData {
    dish: UpdateKitchenDish
    access: string
}

interface Props {
    dishId: number
}

const useUpdateKitchenDish = ({ dishId }: Props): UseMutationResult<KitchenDish, Error, UpdateDishData> => {
    const dishService = getKitchenDishService({ dishId })
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateDishData) => dishService.update(data.dish, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchen-dishes'] })
        },
        onError: (error) => {
            console.error('Error updating kitchen dish:', error)
        },
    })
}

export default useUpdateKitchenDish
