import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getToppingService, { type KitchenTopping, type UpdateKitchenTopping } from "../../../services/kitchen/toppingService"

interface UpdateToppingData {
    topping: UpdateKitchenTopping
    access: string
}

interface Props {
    toppingId: number
}

const useUpdateTopping = ({ toppingId }: Props): UseMutationResult<KitchenTopping, Error, UpdateToppingData> => {
    const toppingService = getToppingService({ toppingId })
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateToppingData) => toppingService.update(data.topping, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchen-toppings'] })
        },
        onError: (error) => {
            console.error('Error updating topping:', error)
        },
    })
}

export default useUpdateTopping
