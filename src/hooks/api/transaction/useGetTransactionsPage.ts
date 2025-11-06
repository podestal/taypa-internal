import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import getTransactionService, { type TransactionPaginated } from "../../../services/api/transactionService";

interface Props {
    access: string
}

const useGetTransactionsPage = ({ access }: Props): UseQueryResult<TransactionPaginated, Error> => {
    const transactionService = getTransactionService()
    return useQuery<TransactionPaginated, Error>({
        queryKey: ['transactions-page'],
        queryFn: () => transactionService.get(access),
    })
}

export default useGetTransactionsPage