import SunatClient from "./sunatClient"

/**
 * SUNAT Document Response Interface
 * Based on Django API response (SunatDocument model serialized)
 */
export interface Document {
    // Django model fields
    id: string                          // Django UUID (e.g., "292bb50f-979e-4c56-b983-3cad3f43b256")
    document_type: string                // "03" = Boleta, "01" = Factura
    serie: string                       // Serie (e.g., "B001")
    numero: string                      // Número (e.g., "00000003")
    
    // SUNAT response data
    sunat_id: string | null             // SUNAT document ID (e.g., "675c6aac40264100151a3d26")
    sunat_status: string | null          // SUNAT status: "ACEPTADO", "EXCEPCION", "RECHAZADO"
    status: string                      // Internal status: "pending", "processing", "accepted", "rejected", "exception", "failed"
    
    // SUNAT URLs
    xml_url: string | null               // URL to download XML ZIP file
    cdr_url: string | null              // URL to download CDR ZIP file
    
    // SUNAT timestamps
    sunat_issue_time: number | null      // Unix timestamp of issue
    sunat_response_time: number | null   // Unix timestamp of SUNAT response
    
    // Environment flags
    production: boolean                  // false = sandbox, true = production
    is_purchase: boolean                // false = sale, true = purchase
    
    // Errors
    faults: any[] | null                // Array of fault/error objects or null
    error_message: string | null         // Internal error message
    
    // Financial
    amount: string | null                // Total amount (as string from DecimalField)
    
    // Files
    pdf_file: string | null              // URL to PDF file in Cloudflare R2
    
    // Timestamps
    created_at: string                   // ISO datetime string
    updated_at: string                   // ISO datetime string
}

export const getDocumentsService = new SunatClient<DocumentsPage | Document[]>('/documents/')

export interface DocumentsPage {
    count: number
    next: string | null
    previous: string | null
    results: Document[]
}

interface GetAllDocumentsServiceProps {
    documentType: string
}

export const syncDocumentsService = () => new SunatClient<void>('/documents/sync-today/')

export const getAllDocumentsService = ({ documentType }: GetAllDocumentsServiceProps) => {

    let url = '/documents/'
    if (documentType === '01') url += 'get-invoices/'
    else if (documentType === '03') url += 'get-tickets/'

    return new SunatClient<DocumentsPage>(url)
}

export interface OrderItem {
    id: string
    name: string
    quantity: number
    cost: number
}

export interface CreateTicketRequest {
    order_items: OrderItem[]
    order_id?: number
    return_pdf?: true
}

export interface CreateInvoiceRequest {
    order_items: OrderItem[]
    ruc: string
    razon_social: string
    address: string
    order_id?: number
    return_pdf?: true
}

export const createTicketService = () => {
    return new SunatClient<any, CreateTicketRequest>('/documents/create-ticket/')
}

export const createInvoiceService = () => {
    return new SunatClient<any, CreateInvoiceRequest>('/documents/create-invoice/')
}
