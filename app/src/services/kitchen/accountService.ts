import KitchenClient from "./kitchenClient"

export interface KitchenAccount {
    id: number
    name: string
    balance: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export type CreateKitchenAccount = Pick<KitchenAccount, 'name' | 'balance' | 'is_active'>

export type UpdateKitchenAccount = Partial<Pick<KitchenAccount, 'name' | 'balance' | 'is_active'>>

interface Props {
    accountId?: number
}

const getKitchenAccountService = ({ accountId }: Props = {}) => {
    let url = 'accounts/'
    if (accountId) {
        url += `${accountId}/`
    }
    return new KitchenClient<KitchenAccount[], CreateKitchenAccount, UpdateKitchenAccount>(url)
}

export default getKitchenAccountService
