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

export const getKitchenCustomersService = () =>
    new KitchenClient<KitchenCustomer[]>('customers/')

export default getKitchenCustomerService
