import type { Document } from '../services/sunat/documentService'

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
    const blob = await response.blob()
    
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
 * Convert Document from API to SunatDocument for UI
 */
export const mapDocumentToSunatDocument = (doc: Document) => {
  const parsed = parseFileName(doc.fileName)
  const tipo_documento = getDocumentTypeName(doc.type)
  
  return {
    id: doc.id,
    numero: parsed?.numero || '',
    serie: parsed?.serie || '',
    fecha_emision: new Date(doc.issueTime * 1000).toISOString(),
    cliente_ruc: parsed?.ruc,
    cliente_nombre: '', // Not available in API response
    cliente_direccion: '', // Not available in API response
    total: 0, // Need to get from XML or store when creating
    estado: doc.status.toLowerCase() as 'enviado' | 'aceptado' | 'rechazado' | 'pendiente',
    tipo_documento,
    orden_id: undefined, // Would need to be stored when creating
    // Additional fields from API
    xml: doc.xml,
    cdr: doc.cdr,
    issueTime: doc.issueTime,
    responseTime: doc.responseTime,
    production: doc.production,
    faults: doc.faults
  }
}

