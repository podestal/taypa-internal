import { create } from "zustand"

interface OrderStepState {
    orderStep: 'customer' | 'address' | 'items'
    setOrderStep: (orderStep: 'customer' | 'address' | 'items') => void
}

const useOrderStep = create<OrderStepState>((set) => ({
    orderStep: 'customer',
    setOrderStep: (orderStep) => set({ orderStep }),
}))

export default useOrderStep