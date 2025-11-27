import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import SunatDocumentsList from './SunatDocumentsList'
import useGetAllDocuments from '../../hooks/sunat/useGetAllDocuments'
import { mapDocumentToSunatDocument } from '../../utils/sunatHelpers'
import Paginator from '../ui/Paginator'
import useAuthStore from '../../store/useAuthStore'

const FacturasTab = () => {
  const [page, setPage] = useState(1)
  const access = useAuthStore(state => state.access) || ''
  const { data: facturasData, isLoading, error, refetch } = useGetAllDocuments({ access, documentType: '01', page })

  // Map API documents to UI format
  const facturas = useMemo(() => {
    if (!facturasData?.results) return []
    return facturasData.results.map(mapDocumentToSunatDocument)
  }, [facturasData])

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <p className="text-red-500 text-lg">Error al cargar las facturas</p>
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
        documents={facturas} 
        type="facturas" 
        isLoading={isLoading}
      />
      {facturasData && (
        <Paginator
          page={page}
          setPage={setPage}
          itemsCount={facturasData.count}
          itemsPerPage={10}
          refetch={refetch}
        />
      )}
    </motion.div>
  )
}

export default FacturasTab

