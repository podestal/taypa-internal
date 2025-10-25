import { motion } from "framer-motion";
import useCreateAddress from "../../hooks/api/address/useCreateAddress"
import AddressForm from "./AddressForm"

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
    handleNextStep: () => void
    customerInfo: {
        id: number;
        firstName: string;
        lastName: string;
        phone: string;
    }
}

const CreateAddress = ({ handleNextStep, addressInfo, setAddressInfo, customerInfo }: Props) => {

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
            addressInfo={addressInfo}
            setAddressInfo={setAddressInfo}
            customerInfo={customerInfo}
        />
    </motion.div>
    )
}

export default CreateAddress