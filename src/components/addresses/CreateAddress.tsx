import { motion } from "framer-motion";
import useCreateAddress from "../../hooks/api/address/useCreateAddress"
import AddressForm from "./AddressForm"
import useCustomerInfo from "../../store/useCustomerInfo"

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
}

const CreateAddress = ({ handleNextStep, addressInfo, setAddressInfo }: Props) => {
    
    const customerInfo = useCustomerInfo(state => state.customerInfo)
    const createAddress = useCreateAddress({ customerId: customerInfo.id })
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
        />
    </motion.div>
    )
}

export default CreateAddress