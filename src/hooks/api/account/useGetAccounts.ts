import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { getAccountsService, type Account } from '../../../services/api/accountService'

interface UseGetAccountsProps {
  access: string
}

const useGetAccounts = ({ access }: UseGetAccountsProps): UseQueryResult<Account[], Error> => {
  const accountService = getAccountsService()

  return useQuery<Account[], Error>({
    queryKey: ['accounts'],
    queryFn: () => accountService.get(access),
    enabled: !!access
  })
}

export default useGetAccounts