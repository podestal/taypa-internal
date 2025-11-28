import { useMutation, useQueryClient } from "@tanstack/react-query"
import { syncDocumentsService } from "../../services/sunat/documentService"

interface SyncResponse {
  success: boolean
  message?: string
  lastSync?: string
}

interface Props {
    access: string
}

const useSyncSunat = ({ access }: Props) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => syncDocumentsService().get(access),
    onSuccess: () => {
      // Invalidate both boletas and facturas queries
      queryClient.invalidateQueries({ queryKey: ['all documents', '03'] })
      queryClient.invalidateQueries({ queryKey: ['all documents', '01'] })
    },
  })
}

export default useSyncSunat

