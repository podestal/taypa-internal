import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import documentService, { type Document } from "../../services/sunat/documentService" 

const useGetAllDocuments = (): UseQueryResult<Document[], Error> => {
    return useQuery({
        queryKey: ['all documents'],
        queryFn: () => documentService.get(),
        staleTime: 1 * 60 * 1000,
    })
}

export default useGetAllDocuments