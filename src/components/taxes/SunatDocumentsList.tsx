import { motion } from 'framer-motion'
import { FileText, CheckCircle2, XCircle, Clock, Download, AlertCircle } from 'lucide-react'
import moment from 'moment'

export interface SunatDocument {
  id: string
  numero: string
  serie: string
  fecha_emision: string
  cliente_ruc?: string
  cliente_nombre: string
  cliente_direccion?: string
  total: number
  estado: 'enviado' | 'aceptado' | 'rechazado' | 'pendiente' | 'excepcion'
  tipo_documento: 'boleta' | 'factura'
  orden_id?: number
  // Additional fields from API
  xml?: string
  cdr?: string
  issueTime?: number
  responseTime?: number
  production?: boolean
  faults?: any[]
}

interface Props {
  documents: SunatDocument[]
  type: 'boletas' | 'facturas'
  isLoading?: boolean
}

const SunatDocumentsList = ({ documents, type, isLoading }: Props) => {
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No hay {type} registradas</p>
        <p className="text-gray-400 text-sm mt-2">
          Las {type} aparecerán aquí una vez que se generen desde las órdenes
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {documents.map((doc, index) => (
        <motion.div
          key={doc.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <FileText className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {type === 'boletas' ? 'Boleta' : 'Factura'} {doc.serie}-{doc.numero}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Emitida el {moment(doc.fecha_emision).format('DD/MM/YYYY')}
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
                {doc.total > 0 ? (
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(doc.total)}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Monto no disponible
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
            {doc.xml && (
              <motion.a
                href={doc.xml}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                <span>XML</span>
              </motion.a>
            )}
            {doc.cdr && (
              <motion.a
                href={doc.cdr}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                <span>CDR</span>
              </motion.a>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default SunatDocumentsList

