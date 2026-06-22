import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, XCircle, Info } from 'lucide-react'
import useNotificationStore from '../../store/useNotificationStore'

const NotificationCard = () => {
  const { notifications, removeNotification } = useNotificationStore()

  const getIcon = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      case 'error':
        return <XCircle className="w-5 h-5" />
      case 'info':
        return <Info className="w-5 h-5" />
    }
  }

  const getStyles = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600',
          title: 'text-green-900'
        }
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600',
          title: 'text-red-900'
        }
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600',
          title: 'text-blue-900'
        }
    }
  }

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => {
          const styles = getStyles(notification.type)
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className={`${styles.bg} ${styles.border} border-2 rounded-lg shadow-lg p-4 min-w-[320px] max-w-[420px] pointer-events-auto`}
            >
              <div className="flex items-start gap-3">
                <div className={`${styles.icon} flex-shrink-0 mt-0.5`}>
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`${styles.title} font-semibold text-sm mb-1`}>
                    {notification.title}
                  </h3>
                  <p className={`${styles.text} text-sm`}>
                    {notification.message}
                  </p>
                </div>
                
                <motion.button
                  onClick={() => removeNotification(notification.id)}
                  className={`${styles.icon} p-1 rounded hover:bg-black/5 transition-colors flex-shrink-0`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default NotificationCard