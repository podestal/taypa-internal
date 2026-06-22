import APIClient from "./apiClient"

// class Customer(models.Model):
//     first_name = models.CharField(max_length=255)
//     last_name = models.CharField(max_length=255)
//     phone_number = models.CharField(max_length=255)
//     created_at = models.DateTimeField(auto_now_add=True)
//     updated_at = models.DateTimeField(auto_now=True)

export interface Customer {
    id: number
    first_name: string
    last_name: string
    phone_number: string
    created_at: string
    updated_at: string
}

export type CreateUpdateCustomer = Omit<Customer, 'id' | 'created_at' | 'updated_at'>

interface Props {
    byFirstName?: boolean
    byLastName?: boolean
    customerId?: number
}

const getCustomerService = ({ byFirstName, byLastName, customerId }: Props) => {
    let url = '/customers/'
    if (byFirstName) {
        url += `by_first_name/`
    }
    if (byLastName) {
        url += `by_last_name/`
    }
    if (customerId) {
        url += `${customerId}/`
    }
    return new APIClient<Customer, CreateUpdateCustomer>(url)
}

export default getCustomerService
