import APIClient from "./apiClient";

export interface Address {
    id: number
    street: string
    reference: string
    created_at: Date
    updated_at: Date
    is_primary: boolean
    customer: number
}

export type CreateUpdateAddress = Omit<Address, 'id' | 'created_at' | 'updated_at'>

interface Props {
    byCustomer?: boolean
    addressId?: number
}

const getAddressService = ({ byCustomer, addressId }: Props) => {
    let url = '/addresses/'
    if (byCustomer) {
        url += `by_customer/`
    }
    if (addressId) {
        url += `${addressId}/`
    }
    return new APIClient<Address[], CreateUpdateAddress>(url)
}

export default getAddressService