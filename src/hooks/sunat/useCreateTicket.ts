import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createTicketService, type CreateTicketRequest } from "../../services/sunat/documentService"

interface Props {
    access: string
}

const useCreateTicket = ({ access }: Props) => {
    const queryClient = useQueryClient()
    const ticketService = createTicketService()

    return useMutation({
        mutationFn: (data: CreateTicketRequest) => ticketService.post(data, access),
        onSuccess: () => {
            // Invalidate orders and documents queries
            queryClient.invalidateQueries({ queryKey: ['orders for billing'] })
            queryClient.invalidateQueries({ queryKey: ['all documents', '03'] })
            queryClient.invalidateQueries({ queryKey: ['all documents', '01'] })
        },
    })
}

export default useCreateTicket

