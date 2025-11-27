import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { mapDocumentToSunatDocument } from '../../utils/sunatHelpers'
import SunatDocumentsList from './SunatDocumentsList'
import useGetAllDocuments from '../../hooks/sunat/useGetAllDocuments'

const BoletasTab = () => {
  const { data: boletasData, isLoading, error } = useGetAllDocuments({ documentType: '03' })

  // Map API documents to UI format
  const boletas = useMemo(() => {
    if (!boletasData?.results) return []
    return boletasData.results.map(mapDocumentToSunatDocument)
  }, [boletasData])

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <p className="text-red-500 text-lg">Error al cargar las boletas</p>
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
        documents={boletas} 
        type="boletas" 
        isLoading={isLoading}
      />
    </motion.div>
  )
}

export default BoletasTab

