import { jwtDecode } from 'jwt-decode'
import { create } from 'zustand'

interface DecodedToken {
    exp: number
    iat: number
    jti: string
    token_type: string
    user_id: string
}

interface AuthState {
    access: string | null 
    refresh: string | null 
    userId: number
    setUserId: (id: number) => void
    setTokens: (access: string, refresh: string) => void
    clearTokens: () => void
    getDecodedToken: () => DecodedToken | null
}

// Helper function to safely decode token and extract user_id
const decodeToken = (token: string | null): number => {
    if (!token) {
        return 0
    }
    try {
        const decoded = jwtDecode<DecodedToken>(token)
        // user_id comes as string from token, convert to number
        return decoded.user_id ? parseInt(decoded.user_id, 10) : 0
    } catch (error) {
        console.error('Error decoding token:', error)
        return 0
    }
}

const useAuthStore = create<AuthState>((set, get) => {
    const access = localStorage.getItem('access')
    const userId = decodeToken(access)

    return {
        access,
        refresh: localStorage.getItem('refresh'),
        userId,

        setTokens: (access, refresh) => {
            localStorage.setItem('access', access) 
            localStorage.setItem('refresh', refresh)
            const userId = decodeToken(access)
            set({ access, refresh, userId }) 
        },

        clearTokens: () => {
            localStorage.removeItem('access') 
            localStorage.removeItem('refresh')
            set({ access: '', refresh: '', userId: 0 }) 
        },

        setUserId: (id) => {
            set({ userId: id })
        },

        getDecodedToken: () => {
            const access = get().access
            if (!access) return null
            try {
                return jwtDecode<DecodedToken>(access)
            } catch (error) {
                console.error('Error decoding token:', error)
                return null
            }
        }
    }
})

export default useAuthStore