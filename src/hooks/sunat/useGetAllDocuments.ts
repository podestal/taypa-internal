import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { getDocumentsService, type Document } from "../../services/sunat/documentService" 

const useGetAllDocuments = (): UseQueryResult<Document[], Error> => {
    
    return useQuery({
        queryKey: ['all documents'],
        queryFn: () => getDocumentsService.get(),
    })
}

export default useGetAllDocuments