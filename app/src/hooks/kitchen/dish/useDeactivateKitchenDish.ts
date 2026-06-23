import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getKitchenDishService, { type KitchenDish } from "../../../services/kitchen/dishService"

interface DeactivateDishData {
    access: string
}

interface Props {
    dishId: number
}

const useDeactivateKitchenDish = ({ dishId }: Props): UseMutationResult<KitchenDish, Error, DeactivateDishData> => {
    const dishService = getKitchenDishService({ dishId })
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: DeactivateDishData) =>
            dishService.update({ is_active: false }, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchen-dishes'] })
        },
        onError: (error) => {
            console.error('Error deactivating kitchen dish:', error)
        },
    })
}

export default useDeactivateKitchenDish
