import { motion } from "framer-motion";
import CreateAddress from "./CreateAddress";
import { ArrowLeft } from "lucide-react";
import AddressesList from "./AddressesList";

interface Props {
    addressInfo: {
        id: number;
        street: string;
        reference: string;
        is_primary: boolean;
        customer: number;
    }
    setAddressInfo: (addressInfo: {
        id: number;
        street: string;
        reference: string;
        is_primary: boolean;
        customer: number;
    }) => void
    customerInfo: {
        id: number;
        firstName: string;
        lastName: string;
        phone: string;
    }
    handleNextStep: () => void
    setOrderStep: (orderStep: 'customer' | 'address' | 'items') => void
}


const AddressesMain = ({ addressInfo, setAddressInfo, customerInfo, handleNextStep, setOrderStep }: Props) => {

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
            addressInfo={addressInfo} 
            setAddressInfo={setAddressInfo} 
        />
        <CreateAddress 
            addressInfo={addressInfo}
            setAddressInfo={setAddressInfo}
            customerInfo={customerInfo}
            handleNextStep={handleNextStep}
        />
    </>
  )
}

export default AddressesMain