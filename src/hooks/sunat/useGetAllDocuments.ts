import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { getAllDocumentsService, type DocumentsPage } from "../../services/sunat/documentService" 

interface Props {
    access: string
    documentType: string
    page: number
}

const useGetAllDocuments = ({ access, documentType, page }: Props): UseQueryResult<DocumentsPage, Error> => {

    const documentService = getAllDocumentsService({ documentType })
    const params: Record<string, string> = {
        page: page.toString(),
    }
    
    return useQuery({
        queryKey: ['all documents', documentType, page],
        queryFn: () => documentService.get(access, params),
        enabled: !!documentType,
    })
}

export default useGetAllDocuments