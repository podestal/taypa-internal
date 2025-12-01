import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { getDocumentsService, type DocumentsPage } from "../../services/sunat/documentService" 

interface Props {
    access: string
    page: number
}

const useGetDocuments = ({ access, page }: Props): UseQueryResult<DocumentsPage, Error> => {
    const params: Record<string, string> = {
        page: page.toString(),
    }
    
    return useQuery({
        queryKey: ['documents', page],
        queryFn: () => getDocumentsService.get(access, params) as Promise<DocumentsPage>,
    })
}

export default useGetDocuments

