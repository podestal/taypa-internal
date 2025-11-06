import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import getTransactionService, { type TransactionPaginated } from "../../../services/api/transactionService";

interface Props {
    access: string
    dateFilter: 'today' | 'last7days' | 'thisWeek' | 'thisMonth' | 'custom' | 'all'
    typeFilter: 'all' | 'I' | 'E'
    sortBy: 'date' | 'amount'
    page: number
}

const useGetTransactionsPage = ({ access, dateFilter = 'today', typeFilter = 'E', sortBy = 'date', page = 1 }: Props): UseQueryResult<TransactionPaginated, Error> => {
    const transactionService = getTransactionService()
    const params: Record<string, string> = {
        date_filter: dateFilter,
        transaction_type: typeFilter,
        sort_by: sortBy,
        page: page.toString(),
    }
    return useQuery<TransactionPaginated, Error>({
        queryKey: ['transactions-page', dateFilter, typeFilter, sortBy, page],
        queryFn: () => transactionService.get(access, params),
    })
}

export default useGetTransactionsPage