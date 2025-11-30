import { FileText } from 'lucide-react'
import SunatDocumentItem from './SunatDocumentItem'
import { type SunatDocument } from '../../utils/sunatHelpers'


interface Props {
  documents: SunatDocument[]
  type: 'boletas' | 'facturas'
  isLoading?: boolean
}

const SunatDocumentsList = ({ documents, type, isLoading }: Props) => {

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
        <SunatDocumentItem
          key={doc.id}
          doc={doc}
          type={type}
          index={index}
        />
      ))}
    </div>
  )
}

export default SunatDocumentsList

