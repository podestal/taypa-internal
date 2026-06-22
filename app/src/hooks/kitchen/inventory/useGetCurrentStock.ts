import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { getCurrentStockService, type CurrentStockItem } from "../../../services/kitchen/inventoryService"
import { normalizeCurrentStock } from "../../../utils/inventoryHelpers"

interface Props {
    access: string
}

const useGetCurrentStock = ({ access }: Props): UseQueryResult<CurrentStockItem[], Error> => {
    const service = getCurrentStockService()
    return useQuery({
        queryKey: ['inventory-current'],
        queryFn: async () => {
            const data = await service.get(access)
            return normalizeCurrentStock(data)
        },
        retry: false,
    })
}

export default useGetCurrentStock
