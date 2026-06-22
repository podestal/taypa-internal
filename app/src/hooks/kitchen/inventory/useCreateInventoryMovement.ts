import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import {
    getInventoryMovementService,
    type InventoryMovement,
    type CreateInventoryMovement,
} from "../../../services/kitchen/inventoryService"

interface CreateMovementData {
    movement: CreateInventoryMovement
    access: string
}

const useCreateInventoryMovement = (): UseMutationResult<InventoryMovement, Error, CreateMovementData> => {
    const service = getInventoryMovementService()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateMovementData) => service.post(data.movement, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory-movements'] })
            queryClient.invalidateQueries({ queryKey: ['inventory-current'] })
            queryClient.invalidateQueries({ queryKey: ['inventory-report'] })
        },
        onError: (error) => {
            console.error('Error creating inventory movement:', error)
        },
    })
}

export default useCreateInventoryMovement
