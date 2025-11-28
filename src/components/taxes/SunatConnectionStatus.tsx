import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react'
import moment from 'moment'
import useSyncSunat from '../../hooks/sunat/useSyncSunat'
import useAuthStore from '../../store/useAuthStore'
import { useState, useEffect } from 'react'

interface SunatConnectionStatusProps {
  connected: boolean
  lastSync?: string
  environment: 'production' | 'sandbox'
}

const SunatConnectionStatus = ({ 
  connected, 
  lastSync: initialLastSync, 
  environment
}: SunatConnectionStatusProps) => {
  const access = useAuthStore(state => state.access) || ''
  const [lastSync, setLastSync] = useState(initialLastSync)
  const syncMutation = useSyncSunat({access})

  useEffect(() => {
    if (initialLastSync) {
      setLastSync(initialLastSync)
    }
  }, [initialLastSync])

  const handleSync = () => {
    syncMutation.mutate(undefined, {
      onSuccess: (data) => {
        setLastSync(new Date().toISOString())
      }
    })
  }
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {connected ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Estado de Conexión SUNAT
            </h3>
            <p className={`text-sm font-medium ${
              connected ? 'text-green-600' : 'text-red-600'
            }`}>
              {connected ? 'Conectado' : 'Desconectado'}
            </p>
          </div>
        </div>
        <motion.button
          onClick={handleSync}
          disabled={syncMutation.isPending || !connected}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            connected && !syncMutation.isPending
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          whileHover={connected && !syncMutation.isPending ? { scale: 1.05 } : {}}
          whileTap={connected && !syncMutation.isPending ? { scale: 0.95 } : {}}
        >
          {syncMutation.isPending ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Sincronizando...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>Sincronizar</span>
            </>
          )}
        </motion.button>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Ambiente</p>
            <p className="font-medium text-gray-900 capitalize">
              {environment === 'production' ? 'Producción' : 'Pruebas'}
            </p>
          </div>
          {lastSync && (
            <div>
              <p className="text-gray-500">Última Sincronización</p>
              <p className="font-medium text-gray-900">
                {moment(lastSync).format('DD/MM/YYYY HH:mm')}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default SunatConnectionStatus

