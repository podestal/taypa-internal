import APIClient from "./apiClient";

// class Address(models.Model):
//     street = models.CharField(max_length=255)
//     reference = models.TextField(blank=True)
//     created_at = models.DateTimeField(auto_now_add=True)
//     updated_at = models.DateTimeField(auto_now=True)
//     is_primary = models.BooleanField(default=False)
//     customer = models.ForeignKey(
//         Customer,
//         on_delete=models.CASCADE,
//         related_name='addresses')

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
        url += `by_customer/${addressId}/`
    }
    if (addressId) {
        url += `${addressId}/`
    }
    return new APIClient<Address, CreateUpdateAddress>(url)
}

export default getAddressService