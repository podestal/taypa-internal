import { jwtDecode } from 'jwt-decode'
import { create } from 'zustand'

interface DecodedToken {
    user_id: number;
}

interface AuthState {
    access: string | null 
    refresh: string | null 
    userId: number
    setUserId: (id: number) => void
    setTokens: (access: string, refresh: string) => void
    clearTokens: () => void 
}

const useAuthStore = create<AuthState>(set => ({

    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),

    userId: localStorage.getItem('access') ? jwtDecode<DecodedToken>(localStorage.getItem('access') || '').user_id : 0,

    setTokens: (access, refresh) => {
        localStorage.setItem('access', access) 
        localStorage.setItem('refresh', refresh)
        set({ access, refresh }) 
    },

    clearTokens: () => {
        localStorage.removeItem('access') 
        localStorage.removeItem('refresh')
        set({ access: '', refresh: '', userId: 0 }) 
    },

    setUserId: (id) => {
        set({ userId: id })
    }
}))

export default useAuthStore