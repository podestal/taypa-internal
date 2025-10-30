import { motion } from "framer-motion"
import useAuthStore from "../../store/useAuthStore"
import useRemoveOrder from "../../hooks/api/order/useRemoveOrder"
import Modal from "../ui/Modal"
import { useState } from "react"
import useCustomerInfo from "../../store/useCustomerInfo"
import useAddressInfo from "../../store/useAddressInfo"
import useOrderInfo from "../../store/useOrderInfo"
import useOrderStep from "../../store/useOrderStep"

const RemoveOrder = () => {

    const setAddressInfo = useAddressInfo(state => state.setAddressInfo)
    const setOrderStep = useOrderStep(state => state.setOrderStep)
    const { orderInfo, setOrderInfo } = useOrderInfo()

    const setCustomerInfo = useCustomerInfo(state => state.setCustomerInfo)
    const access = useAuthStore((state) => state.access) || ''
    const [isOpen, setIsOpen] = useState(false)
    const removeOrder = useRemoveOrder({ orderId: orderInfo.id })
    const handleRemoveOrder = () => {
        removeOrder.mutate({ access }, {
            onSuccess: () => {
                setOrderStep('customer')
                setOrderInfo({
                    id: 0,
                    orderNumber: '',
                    customer: 0,
                    address: 0,
                    createdAt: '',
                    updatedAt: '',
                })
                setCustomerInfo({
                    id: 0,
                    firstName: '',
                    lastName: '',
                    phone: '',
                })
                setAddressInfo({
                    id: 0,
                    street: '',
                    reference: '',
                    is_primary: false,
                    customer: 0,
                })
            },
            onError: (error) => {
                console.error(error)
            }
        })
    }
  return (
    <>
    <motion.button
        onClick={() => setIsOpen(true)}
        className="mb-6 cursor-pointer flex items-center text-red-600 hover:text-red-800 font-medium"
        whileHover={{ scale: 1.02 }}
    >
        Cancelar orden
    </motion.button>
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-center">¿Estás seguro de querer cancelar la orden?</h2>
            <p className="text-gray-600 text-center">Esta acción no se puede deshacer.</p>
            <div className="flex justify-center gap-12">
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer transition-colors" onClick={() => setIsOpen(false)}>Cancelar</button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 cursor-pointer transition-colors" onClick={handleRemoveOrder}>Confirmar</button>
            </div>
        </div>
    </Modal>
    </>
  )
}

export default RemoveOrder