import { motion } from "framer-motion";
import useCreateAddress from "../../hooks/api/address/useCreateAddress"
import AddressForm from "./AddressForm"

interface Props {
    customerInfo: {
        id: number;
        firstName: string;
        lastName: string;
        phone: string;
        address: string;
        addressReference: string;
    }
    setCustomerInfo: (customerInfo: {
        id: number;
        firstName: string;
        lastName: string;
        phone: string;
        address: string;
        addressReference: string;
    }) => void
    handleNextStep: () => void
}

const CreateAddress = ({ handleNextStep, customerInfo, setCustomerInfo }: Props) => {

    const createAddress = useCreateAddress()
    return (
    <motion.div
        key="customer"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
    >
        <AddressForm
            createAddress={createAddress}
            handleNextStep={handleNextStep}
            customerInfo={customerInfo}
            setCustomerInfo={setCustomerInfo}
        />
    </motion.div>
    )
}

export default CreateAddress