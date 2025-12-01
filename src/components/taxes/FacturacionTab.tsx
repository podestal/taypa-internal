import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import SunatDocumentsList from './SunatDocumentsList'
import useGetDocuments from '../../hooks/sunat/useGetDocuments'
import { mapDocumentToSunatDocument } from '../../utils/sunatHelpers'
import Paginator from '../ui/Paginator'
import useAuthStore from '../../store/useAuthStore'

const FacturacionTab = () => {
  const [page, setPage] = useState(1)
  const access = useAuthStore(state => state.access) || ''
  const { data: documentsData, isLoading, error, refetch } = useGetDocuments({ access, page })

  // Map API documents to UI format
  const documents = useMemo(() => {
    if (!documentsData?.results) return []
    return documentsData.results.map(mapDocumentToSunatDocument)
  }, [documentsData])

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <p className="text-red-500 text-lg">Error al cargar los documentos</p>
        <p className="text-red-400 text-sm mt-2">{error.message}</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <SunatDocumentsList 
        documents={documents} 
        type="documentos" 
        isLoading={isLoading}
      />
      {documentsData && (
        <Paginator
          page={page}
          setPage={setPage}
          itemsCount={documentsData.count}
          itemsPerPage={10}
          refetch={refetch}
        />
      )}
    </motion.div>
  )
}

export default FacturacionTab

