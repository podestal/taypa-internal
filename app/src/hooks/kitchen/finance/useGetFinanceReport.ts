import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getFinanceReportService, { type FinanceReport, type FinanceReportParams } from "../../../services/kitchen/financeService"
import { normalizeFinanceReport } from "../../../utils/financeHelpers"

interface Props {
    access: string
    params: FinanceReportParams
    enabled?: boolean
}

const useGetFinanceReport = ({
    access,
    params,
    enabled = true,
}: Props): UseQueryResult<FinanceReport, Error> => {
    const service = getFinanceReportService()
    return useQuery({
        queryKey: ['finance-report', params],
        queryFn: async () => {
            const data = await service.get(access, params as Record<string, string>)
            return normalizeFinanceReport(data)
        },
        enabled: enabled && !!params.start_date && !!params.end_date && !!params.account_id,
        retry: false,
    })
}

export default useGetFinanceReport
