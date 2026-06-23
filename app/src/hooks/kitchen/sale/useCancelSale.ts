import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getSaleService, { type Sale } from "../../../services/kitchen/saleService"

interface CancelSaleData {
    access: string
}

interface Props {
    saleId: number
}

const useCancelSale = ({ saleId }: Props): UseMutationResult<Sale, Error, CancelSaleData> => {
    const saleService = getSaleService({ saleId })
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CancelSaleData) => saleService.delete(data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales'] })
            queryClient.invalidateQueries({ queryKey: ['kitchen-accounts'] })
            queryClient.invalidateQueries({ queryKey: ['inventory-current'] })
            queryClient.invalidateQueries({ queryKey: ['inventory-movements'] })
            queryClient.invalidateQueries({ queryKey: ['inventory-report'] })
        },
        onError: (error) => {
            console.error('Error cancelling sale:', error)
        },
    })
}

export default useCancelSale
