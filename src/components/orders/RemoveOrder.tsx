import { motion } from "framer-motion"
import useAuthStore from "../../store/useAuthStore"
import useRemoveOrder from "../../hooks/api/order/useRemoveOrder"

interface Props {
    orderId: number
    setOrderStep: (orderStep: 'customer' | 'address' | 'items') => void
    setOrderInfo: (orderInfo: {
        id: number;
        orderNumber: string;
        customer: number;
        address: number;
        createdAt: string;
        updatedAt: string;
    }) => void
    setCustomerInfo: (customerInfo: {
        id: number;
        firstName: string;
        lastName: string;
        phone: string;
    }) => void
    setAddressInfo: (addressInfo: {
        id: number;
        street: string;
        reference: string;
        is_primary: boolean;
        customer: number;
    }) => void
}


const RemoveOrder = ({ orderId, setOrderStep, setOrderInfo, setCustomerInfo, setAddressInfo }: Props) => {

    const access = useAuthStore((state) => state.access) || ''
    const removeOrder = useRemoveOrder({ orderId })
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
    <motion.button
        onClick={handleRemoveOrder}
        className="mb-6 cursor-pointer flex items-center text-red-600 hover:text-red-800 font-medium"
        whileHover={{ scale: 1.02 }}
    >
        Cancelar orden
    </motion.button>
  )
}

export default RemoveOrder