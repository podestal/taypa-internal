import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'

interface OrderUpdateMessage {
  type: 'order_update'
  action: 'added' | 'removed'
  order_id: string | number
  status: string
}

const getWebSocketUrl = (): string => {
  // Use environment variable if available, otherwise default to localhost
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'
  
  try {
    // Extract host and port from API URL
    const url = new URL(apiUrl)
    const wsProtocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = url.host // includes port if specified (e.g., localhost:8000)
    
    // Return WebSocket URL in format: ws://localhost:8000/ws/orders/
    const wsUrl = `${wsProtocol}//${host}/ws/orders/`
    console.log('Constructed WebSocket URL:', wsUrl)
    return wsUrl
  } catch (error) {
    console.error('Error constructing WebSocket URL:', error)
    // Fallback to direct localhost
    return 'ws://localhost:8000/ws/orders/'
  }
}

export const useOrderWebSocket = () => {
  const queryClient = useQueryClient()
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5
  const reconnectDelay = 3000 // 3 seconds

  const connect = () => {
    // Don't try to connect if we've exceeded max attempts
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.warn('WebSocket: Max reconnection attempts reached, not attempting to connect')
      return
    }

    try {
      const wsUrl = getWebSocketUrl()
      console.log('Connecting to WebSocket:', wsUrl)
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log('✅ WebSocket connected to orders')
        reconnectAttemptsRef.current = 0
      }

      ws.onmessage = (event) => {
        try {
          console.log('📨 WebSocket message received:', event.data)
          const data: OrderUpdateMessage = JSON.parse(event.data)
          console.log('📦 Parsed WebSocket data:', data)
          
          if (data.type === 'order_update') {
            handleOrderUpdate(data)
          } else {
            console.warn('⚠️ Unknown message type:', data.type)
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error, event.data)
        }
      }

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
        console.error('WebSocket readyState:', ws.readyState)
        // readyState: 0 = CONNECTING, 1 = OPEN, 2 = CLOSING, 3 = CLOSED
      }

      ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        })
        
        // Only attempt to reconnect if it wasn't a clean close and we haven't exceeded max attempts
        if (!event.wasClean && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`🔄 Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`)
            connect()
          }, reconnectDelay)
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.error('❌ Max reconnection attempts reached. WebSocket will not reconnect.')
        }
      }

      wsRef.current = ws
    } catch (error) {
      console.error('❌ Error creating WebSocket connection:', error)
      // Try to reconnect after delay
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current++
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log(`🔄 Retrying WebSocket connection (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`)
          connect()
        }, reconnectDelay)
      }
    }
  }

  const handleOrderUpdate = (data: OrderUpdateMessage) => {
    const { action, order_id, status } = data
    console.log('Handling order update:', { action, order_id, status })

    if (data.type === 'order_update') {
      if (action === 'added') {
        // Add order to kitchen - invalidate and immediately refetch to show the new order
        console.log(`[WebSocket] Order ${order_id} added to kitchen (status: ${status}) - invalidating and refetching queries`)
        
        // Invalidate first
        queryClient.invalidateQueries({ queryKey: ['orders-in-kitchen'] })
        
        // Force immediate refetch - use both methods to ensure it works
        queryClient.refetchQueries({ 
          queryKey: ['orders-in-kitchen'],
          type: 'active'
        }).then(() => {
          console.log('[WebSocket] Kitchen orders refetched successfully')
        }).catch((error) => {
          console.error('[WebSocket] Error refetching kitchen orders:', error)
        })
        
        // Also update orders by status queries
        queryClient.invalidateQueries({ queryKey: ['orders by status', status] })
        queryClient.invalidateQueries({ queryKey: ['orders by status', 'IP'] })
      } else if (action === 'removed') {
        // Remove order from kitchen - immediately remove from cache
        console.log(`[WebSocket] Order ${order_id} removed from kitchen (status: ${status}) - updating cache`)
        // Convert order_id to number for comparison if needed
        const orderIdNum = typeof order_id === 'string' ? parseInt(order_id, 10) : order_id
        queryClient.setQueryData(['orders-in-kitchen'], (oldData: any) => {
          if (!oldData) {
            console.log('No old data to filter')
            return oldData
          }
          const filtered = oldData.filter((order: any) => {
            const orderId = typeof order.id === 'string' ? parseInt(order.id, 10) : order.id
            return orderId !== orderIdNum
          })
          console.log(`Removed order ${order_id}. Remaining orders:`, filtered.length)
          return filtered
        })
        // Also invalidate to ensure consistency
        queryClient.invalidateQueries({ queryKey: ['orders-in-kitchen'] })
        queryClient.invalidateQueries({ queryKey: ['orders by status', status] })
        queryClient.invalidateQueries({ queryKey: ['orders by status'] })
      } else {
        console.log(`[WebSocket] Unknown action: ${action}`)
      }
    }
  }

  useEffect(() => {
    connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])
}

