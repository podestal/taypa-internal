import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getKitchenAccountService, { type KitchenAccount, type CreateKitchenAccount } from "../../../services/kitchen/accountService"

interface CreateAccountData {
    account: CreateKitchenAccount
    access: string
}

const useCreateKitchenAccount = (): UseMutationResult<KitchenAccount, Error, CreateAccountData> => {
    const accountService = getKitchenAccountService()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateAccountData) => accountService.post(data.account, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchen-accounts'] })
        },
        onError: (error) => {
            console.error('Error creating kitchen account:', error)
        },
    })
}

export default useCreateKitchenAccount
