import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { getAllDocumentsService, type DocumentsPage } from "../../services/sunat/documentService" 

interface Props {
    documentType: string
}

const useGetAllDocuments = ({ documentType }: Props): UseQueryResult<DocumentsPage, Error> => {

    const documentService = getAllDocumentsService({ documentType })
    
    return useQuery({
        queryKey: ['all documents'],
        queryFn: () => documentService.get(),
        enabled: !!documentType,
    })
}

export default useGetAllDocuments