import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createInvoiceService, type CreateInvoiceRequest } from "../../services/sunat/documentService"

interface Props {
    access: string
}

const useCreateInvoice = ({ access }: Props) => {
    const queryClient = useQueryClient()
    const invoiceService = createInvoiceService()

    return useMutation({
        mutationFn: (data: CreateInvoiceRequest) => invoiceService.post(data, access),
        onSuccess: () => {
            // Invalidate orders and documents queries
            queryClient.invalidateQueries({ queryKey: ['orders for billing'] })
            queryClient.invalidateQueries({ queryKey: ['all documents', '03'] })
            queryClient.invalidateQueries({ queryKey: ['all documents', '01'] })
        },
    })
}

export default useCreateInvoice

