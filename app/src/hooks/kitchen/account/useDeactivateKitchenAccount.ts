import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getKitchenAccountService, { type KitchenAccount } from "../../../services/kitchen/accountService"

interface DeactivateAccountData {
    access: string
}

interface Props {
    accountId: number
}

const useDeactivateKitchenAccount = ({ accountId }: Props): UseMutationResult<KitchenAccount, Error, DeactivateAccountData> => {
    const accountService = getKitchenAccountService({ accountId })
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: DeactivateAccountData) =>
            accountService.update({ is_active: false }, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchen-accounts'] })
        },
        onError: (error) => {
            console.error('Error deactivating kitchen account:', error)
        },
    })
}

export default useDeactivateKitchenAccount
