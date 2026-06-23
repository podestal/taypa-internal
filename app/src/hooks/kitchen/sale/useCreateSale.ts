import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getSaleService, { type Sale, type CreateSale } from "../../../services/kitchen/saleService"

interface CreateSaleData {
    sale: CreateSale
    access: string
}

const useCreateSale = (): UseMutationResult<Sale, Error, CreateSaleData> => {
    const saleService = getSaleService()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateSaleData) => saleService.post(data.sale, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales'] })
            queryClient.invalidateQueries({ queryKey: ['kitchen-accounts'] })
            queryClient.invalidateQueries({ queryKey: ['inventory-current'] })
            queryClient.invalidateQueries({ queryKey: ['inventory-movements'] })
            queryClient.invalidateQueries({ queryKey: ['inventory-report'] })
        },
        onError: (error) => {
            console.error('Error creating sale:', error)
        },
    })
}

export default useCreateSale
