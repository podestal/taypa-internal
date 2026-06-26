import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import {
    getInventoryMovementService,
    type InventoryMovement,
    type InventoryMovementListParams,
} from "../../../services/kitchen/inventoryService"
import { normalizeMovements } from "../../../utils/inventoryHelpers"

interface Props {
    access: string
    params?: InventoryMovementListParams
    enabled?: boolean
}

const useGetInventoryMovements = ({
    access,
    params = {},
    enabled = true,
}: Props): UseQueryResult<InventoryMovement[], Error> => {
    const service = getInventoryMovementService()
    return useQuery({
        queryKey: ['inventory-movements', params],
        queryFn: async () => {
            const queryParams = Object.fromEntries(
                Object.entries(params).filter(([, value]) => value != null && value !== '')
            ) as Record<string, string>
            const data = await service.get(access, queryParams)
            return normalizeMovements(data)
        },
        enabled,
        retry: false,
    })
}

export default useGetInventoryMovements
