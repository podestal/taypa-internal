import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { getDocumentsService, type DocumentsPage } from "../../services/sunat/documentService" 

export interface DocumentsFilters {
    document_type?: 'boleta' | 'factura'
    date_filter?: 'today' | 'this_week' | 'last_seven_days' | 'this_month' | 'this_year'
    date?: string
    start_date?: string
    end_date?: string
}

interface Props {
    access: string
    page: number
    filters?: DocumentsFilters
}

const useGetDocuments = ({ access, page, filters }: Props): UseQueryResult<DocumentsPage, Error> => {
    const params: Record<string, string> = {
        page: page.toString(),
    }

    // Add filters to params if they exist
    if (filters) {
        if (filters.document_type) {
            params.document_type = filters.document_type
        }
        if (filters.date_filter) {
            params.date_filter = filters.date_filter
        }
        if (filters.date) {
            params.date = filters.date
        }
        if (filters.start_date) {
            params.start_date = filters.start_date
        }
        if (filters.end_date) {
            params.end_date = filters.end_date
        }
    }
    
    return useQuery({
        queryKey: ['documents', page, filters],
        queryFn: () => getDocumentsService.get(access, params) as Promise<DocumentsPage>,
    })
}

export default useGetDocuments

