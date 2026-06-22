import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

interface SyncSingleDocumentData {
  sunat_id: string
  access: string
}

const useSyncSingleDocument = (): UseMutationResult<void, Error, SyncSingleDocumentData> => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ sunat_id, access }: SyncSingleDocumentData) => {
      await axios.post(
        `${import.meta.env.VITE_TAXES_URL}documents/sync-single/?sunat_id=${sunat_id}`,
        {},
        {
          headers: {
            'Authorization': `JWT ${access}`,
            'Content-Type': 'application/json',
          },
        }
      )
    },
    onSuccess: () => {
      // Invalidate all document queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['all documents'] })
    },
    onError: (error) => {
      console.error('Error syncing document:', error)
    }
  })
}

export default useSyncSingleDocument

