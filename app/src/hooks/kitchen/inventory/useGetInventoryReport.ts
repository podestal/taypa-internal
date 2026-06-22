import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import {
    getInventoryReportService,
    type InventoryReportItem,
    type InventoryReportParams,
} from "../../../services/kitchen/inventoryService"
import { normalizeReport } from "../../../utils/inventoryHelpers"

interface Props {
    access: string
    params: InventoryReportParams
    enabled?: boolean
}

const useGetInventoryReport = ({
    access,
    params,
    enabled = true,
}: Props): UseQueryResult<InventoryReportItem[], Error> => {
    const service = getInventoryReportService()
    return useQuery({
        queryKey: ['inventory-report', params],
        queryFn: async () => {
            const data = await service.get(access, params as Record<string, string>)
            return normalizeReport(data)
        },
        enabled,
        retry: false,
    })
}

export default useGetInventoryReport
