import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import {
  getTransactionStatsService,
  type TransactionStatsResponse
} from '../../../services/api/transactionService'

type DateFilter = 'today' | 'last7days' | 'thisWeek' | 'thisMonth' | 'year' | 'custom' | 'all'
type Granularity = 'day' | 'week' | 'month' | 'year'

interface UseGetTransactionStatsProps {
  access: string
  period: DateFilter
  granularity: Granularity
  selectedYear: number
  startDate: string
  endDate: string
}

const useGetTransactionStats = ({
  access,
  period,
  granularity,
  selectedYear,
  startDate,
  endDate
}: UseGetTransactionStatsProps): UseQueryResult<TransactionStatsResponse, Error> => {
  const statsService = getTransactionStatsService()
  const resolvedPeriod = period === 'year' ? 'custom' : period
  const resolvedGranularity = period === 'year' ? 'year' : granularity

  const params: Record<string, string> = {
    period: resolvedPeriod,
    granularity: resolvedGranularity,
    timezone: 'America/Lima',
    currency: 'PEN'
  }

  if (period === 'year') {
    params.start_date = `${selectedYear}-01-01`
    params.end_date = `${selectedYear}-12-31`
  }

  if (period === 'custom') {
    params.start_date = startDate
    params.end_date = endDate
  }

  return useQuery<TransactionStatsResponse, Error>({
    queryKey: ['transaction-stats', period, granularity, selectedYear, startDate, endDate],
    queryFn: () => statsService.get(access, params),
    enabled: !!access && !(period === 'custom' && (!startDate || !endDate))
  })
}

export default useGetTransactionStats
