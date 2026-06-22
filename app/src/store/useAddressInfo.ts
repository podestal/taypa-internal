// id: 0,
// street: '',
// reference: '',
// is_primary: false,
// customer: 0,

import { create } from "zustand"

interface AddressInfo {
    id: number
    street: string
    reference: string
    is_primary: boolean
    customer: number
}

interface AddressInfoState {
    addressInfo: AddressInfo
    setAddressInfo: (addressInfo: AddressInfo) => void
}

const useAddressInfo = create<AddressInfoState>((set) => ({
    addressInfo: {
        id: 0,
        street: '',
        reference: '',
        is_primary: false,
        customer: 0,
    },
    setAddressInfo: (addressInfo) => set({ addressInfo }),
}))

export default useAddressInfo