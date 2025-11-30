import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { mapDocumentToSunatDocument } from '../../utils/sunatHelpers'
import SunatDocumentsList from './SunatDocumentsList'
import useGetAllDocuments from '../../hooks/sunat/useGetAllDocuments'
import Paginator from '../ui/Paginator'
import useAuthStore from '../../store/useAuthStore'

const BoletasTab = () => {
  const access = useAuthStore(state => state.access) || ''
  const [page, setPage] = useState(1)
  const { data: boletasData, isLoading, error, refetch } = useGetAllDocuments({ access, documentType: '03', page })

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
      <>{console.log('boletas', boletas)}</>
      <SunatDocumentsList 
        documents={boletas} 
        type="boletas" 
        isLoading={isLoading}
      />
      {boletasData && (
        <Paginator
          page={page}
          setPage={setPage}
          itemsCount={boletasData.count}
          itemsPerPage={10}
          refetch={refetch}
        />
      )}
    </motion.div>
  )
}

export default BoletasTab

