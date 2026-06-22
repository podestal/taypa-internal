import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getKitchenAccountService, { type KitchenAccount, type UpdateKitchenAccount } from "../../../services/kitchen/accountService"

interface UpdateAccountData {
    account: UpdateKitchenAccount
    access: string
}

interface Props {
    accountId: number
}

const useUpdateKitchenAccount = ({ accountId }: Props): UseMutationResult<KitchenAccount, Error, UpdateAccountData> => {
    const accountService = getKitchenAccountService({ accountId })
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateAccountData) => accountService.update(data.account, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchen-accounts'] })
        },
        onError: (error) => {
            console.error('Error updating kitchen account:', error)
        },
    })
}

export default useUpdateKitchenAccount
