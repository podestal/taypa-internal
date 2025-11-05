import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import getTransactionService, { type TransactionPaginated} from "../../../services/api/transactionService";

interface Props {
    access: string
}

const useGetTransactionsByCurrentDay = ({ access }: Props): UseQueryResult<TransactionPaginated, Error> => {
    
    const transactionService = getTransactionService({ byCurrentDay: true })
    return useQuery<TransactionPaginated, Error>({
        queryKey: ['transactions-by-current-day'],
        queryFn: () => transactionService.get(access),
    })
}

export default useGetTransactionsByCurrentDay