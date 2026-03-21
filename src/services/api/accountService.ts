import APIClient from "./apiClient"

export interface Account {
    id: number
    name: string
    balance: number
    account_type: string
    is_active: boolean
    created_at: Date
    updated_at: Date
}

export const getAccountsService = () => {
    return new APIClient<Account[]>('/accounts/')
}



