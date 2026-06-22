interface Props {
    orderNumber: string
    timeElapsed: number
    updated_at: Date
    getTimeColor: (seconds: number) => string
}

const KitchenOrderTimer = ({ orderNumber, timeElapsed, updated_at, getTimeColor }: Props) => {

    const formatTimer = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
      }

  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Orden #{orderNumber}</h3>
        <div className="text-sm text-gray-600">
          {new Date(updated_at).toLocaleTimeString('es-MX', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
      <div className={`px-3 py-2 rounded-lg font-bold text-lg ${getTimeColor(timeElapsed)}`}>
        {formatTimer(timeElapsed)}
      </div>
    </div>
  )
}

export default KitchenOrderTimer