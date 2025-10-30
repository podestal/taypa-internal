import { motion } from "framer-motion";
import CreateAddress from "./CreateAddress";
import { ArrowLeft } from "lucide-react";
import AddressesList from "./AddressesList";
import useCustomerInfo from "../../store/useCustomerInfo";
import useAddressInfo from "../../store/useAddressInfo";

interface Props {
    handleNextStep: () => void
    setOrderStep: (orderStep: 'customer' | 'address' | 'items') => void
}


const AddressesMain = ({ handleNextStep, setOrderStep }: Props) => {

    const customerInfo = useCustomerInfo(state => state.customerInfo)
    const setAddressInfo = useAddressInfo(state => state.setAddressInfo)
  return (
    <>
        <motion.button
            onClick={() => {
                setOrderStep('customer')
                setAddressInfo({
                    id: 0,
                    street: '',
                    reference: '',
                    is_primary: false,
                    customer: 0,
                })
            }}
            className="mb-6 flex items-center cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
            whileHover={{ scale: 1.02 }}
        >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Editar información del cliente
        </motion.button>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información del domicilio</h3>
        <AddressesList 
            customerId={customerInfo.id} 
        />
        <CreateAddress 
            handleNextStep={handleNextStep}
        />
    </>
  )
}

export default AddressesMain