import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getToppingService, { type KitchenTopping } from "../../../services/kitchen/toppingService"

interface DeactivateToppingData {
    access: string
}

interface Props {
    toppingId: number
}

const useDeactivateTopping = ({ toppingId }: Props): UseMutationResult<KitchenTopping, Error, DeactivateToppingData> => {
    const toppingService = getToppingService({ toppingId })
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: DeactivateToppingData) =>
            toppingService.update({ is_active: false }, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchen-toppings'] })
        },
        onError: (error) => {
            console.error('Error deactivating topping:', error)
        },
    })
}

export default useDeactivateTopping
