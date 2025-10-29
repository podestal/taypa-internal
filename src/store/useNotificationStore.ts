import { create } from "zustand"

export interface Notification {
    id: string
    title: string
    message: string
    type: 'success' | 'error' | 'info'
    duration?: number // Optional: duration in milliseconds (default: 5000)
}

interface NotificationStore {
    notifications: Notification[]
    addNotification: (notification: Omit<Notification, 'id'>) => void
    removeNotification: (id: string) => void
    clearNotifications: () => void
}

const useNotificationStore = create<NotificationStore>((set) => ({
    notifications: [],
    
    addNotification: (notification) => {
        const id = Math.random().toString(36).substring(7)
        const newNotification: Notification = {
            ...notification,
            id,
            duration: notification.duration || 5000
        }
        
        set((state) => ({
            notifications: [...state.notifications, newNotification]
        }))
        
        // Auto remove after duration
        setTimeout(() => {
            set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id)
            }))
        }, newNotification.duration)
    },
    
    removeNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id)
        }))
    },
    
    clearNotifications: () => {
        set({ notifications: [] })
    }
}))

export default useNotificationStore
