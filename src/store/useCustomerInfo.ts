import { create } from "zustand"

interface CustomerInfo {
    id: number
    firstName: string
    lastName: string
    phone: string
}

interface CustomerInfoState {
    customerInfo: CustomerInfo
    setCustomerInfo: (customerInfo: CustomerInfo) => void
}

const useCustomerInfo = create<CustomerInfoState>((set) => ({
    customerInfo: {
        id: 0,
        firstName: '',
        lastName: '',
        phone: '',
    },
    setCustomerInfo: (customerInfo) => set({ customerInfo }),
}))

export default useCustomerInfo