import KitchenClient from "./kitchenClient"

export interface KitchenCustomer {
    id: string
    names: string
    address: string
    extra_info: string
}

export interface CreateKitchenCustomer {
    names: string
    address?: string
    extra_info?: string
}

const getKitchenCustomerService = () =>
    new KitchenClient<KitchenCustomer, CreateKitchenCustomer>('customers/')

export default getKitchenCustomerService
