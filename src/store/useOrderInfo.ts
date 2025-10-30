import { create } from "zustand"

interface OrderInfo {
    id: number
    orderNumber: string
    customer: number
    address: number
    createdAt: string
    updatedAt: string
}

interface OrderInfoState {
    orderInfo: OrderInfo
    setOrderInfo: (orderInfo: OrderInfo) => void
}

const useOrderInfo = create<OrderInfoState>((set) => ({
    orderInfo: {
        id: 0,
        orderNumber: '',
        customer: 0,
        address: 0,
        createdAt: '',
        updatedAt: '',
    },
    setOrderInfo: (orderInfo) => set({ orderInfo }),
}))

export default useOrderInfo