import type { Document } from '../services/sunat/documentService'

/**
 * SunatDocument interface for UI display
 * Mapped from Django API Document response
 */
export interface SunatDocument {
  id: string
  numero: string
  serie: string
  fecha_emision: string
  cliente_ruc?: string
  cliente_nombre: string
  cliente_direccion: string
  total: number
  estado: 'enviado' | 'aceptado' | 'rechazado' | 'pendiente' | 'excepcion'
  tipo_documento: 'boleta' | 'factura'
  orden_id?: number | string
  // Additional fields from API
  xml: string | null
  cdr: string | null
  issueTime: number | null
  responseTime: number | null
  production: boolean
  faults: any[] | null
}

/**
 * Parse fileName to extract document information
 * Format: "RUC-TYPE-SERIE-NUMERO"
 * Example: "20482674828-03-B001-00000001"
 */
export const parseFileName = (fileName: string) => {
  const parts = fileName.split('-')
  if (parts.length >= 4) {
    return {
      ruc: parts[0],
      type: parts[1],
      serie: parts[2],
      numero: parts[3]
    }
  }
  return null
}

/**
 * Get document type name from code
 * 01 = Factura
 * 03 = Boleta
 */
export const getDocumentTypeName = (type: string): 'boleta' | 'factura' => {
  return type === '01' ? 'factura' : 'boleta'
}

/**
 * Get document type label
 */
export const getDocumentTypeLabel = (type: string): string => {
  return type === '01' ? 'Factura' : 'Boleta'
}

/**
 * Parse XML to extract total amount
 * This is a helper function that can be used to fetch and parse the XML
 * Note: In production, it's better to store the amount when creating the document
 */
export const extractAmountFromXml = async (xmlUrl: string): Promise<number | null> => {
  try {
    const response = await fetch(xmlUrl)
    await response.blob()
    
    // The XML is inside a ZIP file, so we'd need to:
    // 1. Unzip the file
    // 2. Parse the XML
    // 3. Extract the total amount
    // This is complex and requires additional libraries
    
    // For now, return null and suggest storing the amount
    return null
  } catch (error) {
    console.error('Error fetching XML:', error)
    return null
  }
}

/**
 * Convert Document from Django API to SunatDocument for UI
 */
export const mapDocumentToSunatDocument = (doc: Document): SunatDocument => {
  const tipo_documento = getDocumentTypeName(doc.document_type)
  
  // Convert amount from string to number
  const total = doc.amount ? parseFloat(doc.amount) : 0
  
  // Map status - use sunat_status if available, otherwise use internal status
  let estado: 'enviado' | 'aceptado' | 'rechazado' | 'pendiente' | 'excepcion' = 'pendiente'
  if (doc.sunat_status) {
    const sunatStatus = doc.sunat_status.toUpperCase()
    if (sunatStatus === 'ACEPTADO') estado = 'aceptado'
    else if (sunatStatus === 'RECHAZADO') estado = 'rechazado'
    else if (sunatStatus === 'EXCEPCION') estado = 'excepcion'
  } else {
    // Use internal status
    const internalStatus = doc.status.toLowerCase()
    if (internalStatus === 'accepted') estado = 'aceptado'
    else if (internalStatus === 'rejected') estado = 'rechazado'
    else if (internalStatus === 'exception') estado = 'excepcion'
    else if (internalStatus === 'processing') estado = 'enviado'
    else estado = 'pendiente'
  }
  
  return {
    id: doc.id,
    numero: doc.numero,
    serie: doc.serie,
    fecha_emision: doc.sunat_issue_time 
      ? new Date(doc.sunat_issue_time * 1000).toISOString()
      : doc.created_at,
    cliente_ruc: undefined, // Not in Django response, would need to add to model
    cliente_nombre: '', // Not in Django response, would need to add to model
    cliente_direccion: '', // Not in Django response, would need to add to model
    total,
    estado,
    tipo_documento,
    orden_id: undefined, // Would need to be in Django response
    // Additional fields from API
    xml: doc.xml_url,
    cdr: doc.cdr_url,
    issueTime: doc.sunat_issue_time,
    responseTime: doc.sunat_response_time,
    production: doc.production,
    faults: doc.faults
  }
}

