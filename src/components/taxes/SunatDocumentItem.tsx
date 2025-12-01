import { motion } from 'framer-motion'
import { FileText, CheckCircle2, XCircle, Clock, AlertCircle, FileDown } from 'lucide-react'
import moment from 'moment'
import type { SunatDocument } from '../../utils/sunatHelpers'

interface Props {
  doc: SunatDocument
  type: 'boletas' | 'facturas' | 'documentos'
  index: number
}

const SunatDocumentItem = ({ doc, type, index }: Props) => {
  // Determine document type from serie: B001 = Boleta, F001 = Factura
  const getDocumentTypeFromSerie = (serie: string): 'boleta' | 'factura' => {
    if (serie.startsWith('B')) return 'boleta'
    if (serie.startsWith('F')) return 'factura'
    // Fallback to tipo_documento if serie doesn't match pattern
    return doc.tipo_documento || 'boleta'
  }

  const documentType = type === 'documentos' ? getDocumentTypeFromSerie(doc.serie) : type === 'boletas' ? 'boleta' : 'factura'
  const documentLabel = documentType === 'boleta' ? 'Boleta' : 'Factura'

  const getStatusIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'aceptado':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'rechazado':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'excepcion':
        return <AlertCircle className="w-5 h-5 text-orange-600" />
      case 'enviado':
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'aceptado':
        return 'bg-green-100 text-green-800'
      case 'rechazado':
        return 'bg-red-100 text-red-800'
      case 'excepcion':
        return 'bg-orange-100 text-orange-800'
      case 'enviado':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        {/* <>{console.log('doc', doc)}</> */}
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                {documentLabel} {doc.serie}-{doc.numero}
              </h4>
              <p className="text-sm text-gray-500">
                Emitida el {moment(doc.created_at).format('DD/MM/YYYY')}
              </p>
            </div>
          </div>
          
          <div className="mt-3 space-y-2">
            {doc.cliente_ruc && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">RUC:</span>
                <span className="text-sm font-medium text-gray-900">
                  {doc.cliente_ruc}
                </span>
              </div>
            )}
            {doc.cliente_nombre && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Cliente:</span>
                <span className="text-sm font-medium text-gray-900">
                  {doc.cliente_nombre}
                </span>
              </div>
            )}
            {doc.cliente_direccion && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Dirección:</span>
                <span className="text-sm font-medium text-gray-900">
                  {doc.cliente_direccion}
                </span>
              </div>
            )}
            {doc.orden_id && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Orden ID:</span>
                <span className="text-sm font-medium text-gray-900">
                  #{doc.orden_id}
                </span>
              </div>
            )}
            {doc.faults && doc.faults.length > 0 && (
              <div className="mt-2 p-2 bg-orange-50 rounded border border-orange-200">
                <p className="text-xs font-semibold text-orange-800 mb-1">Errores:</p>
                {doc.faults.map((fault: any, idx: number) => (
                  <p key={idx} className="text-xs text-orange-700">
                    {fault.faultstring?._text || JSON.stringify(fault)}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(doc.estado)}`}>
            {getStatusIcon(doc.estado)}
            <span className="capitalize">{doc.estado}</span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(doc.total)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
        <motion.button
          className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!doc.pdf_file}
          title={doc.pdf_file ? 'Descargar PDF' : 'PDF no disponible'}
        >
          <FileDown className="w-4 h-4" />
          <span>PDF</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default SunatDocumentItem

