import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { getInventoryMovementService, type InventoryMovement } from "../../../services/kitchen/inventoryService"
import { normalizeMovements } from "../../../utils/inventoryHelpers"

interface Props {
    access: string
}

const useGetInventoryMovements = ({ access }: Props): UseQueryResult<InventoryMovement[], Error> => {
    const service = getInventoryMovementService()
    return useQuery({
        queryKey: ['inventory-movements'],
        queryFn: async () => {
            const data = await service.get(access)
            return normalizeMovements(data)
        },
        retry: false,
    })
}

export default useGetInventoryMovements
