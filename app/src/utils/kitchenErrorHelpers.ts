import axios from 'axios'

export const getKitchenErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data
        if (typeof data === 'string') return data
        if (data && typeof data === 'object') {
            if ('detail' in data && typeof data.detail === 'string') return data.detail
            const values = Object.values(data).flat()
            const first = values.find(value => typeof value === 'string')
            if (typeof first === 'string') return first
        }
        if (error.response?.status) {
            return `${fallback} (HTTP ${error.response.status})`
        }
    }
    if (error instanceof Error && error.message) return error.message
    return fallback
}
