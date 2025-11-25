import SunatClient from "./sunatClient"


export interface Document {
    fileName: string
    id: string
    issueTime: number
    status: string
    type: string
    production?: boolean
    isPurchase?: boolean
    responseTime?: number
    xml?: string
    cdr?: string
    faults?: any[]
    personaId?: string
}

const personaId = import.meta.env.VITE_PERSONAL_ID
const personaToken = import.meta.env.VITE_PERSONAL_TOKEN

export default new SunatClient<Document[]>('getAll', personaId, personaToken)
