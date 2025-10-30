import { motion } from "framer-motion";
import useCreateCustomer from "../../hooks/api/customer/useCreateCustomer";
import CustomerForm from "./CustomerForm"

interface Props {
    handleNextStep: () => void
}

const CreateCustomer = ({ 
    handleNextStep, 
}: Props) => {
    const createCustomer = useCreateCustomer()
  return (
    <motion.div
        key="customer"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
    >
        <CustomerForm 
            createCustomer={createCustomer}
            handleNextStep={handleNextStep}
        />
    </motion.div>
  )
}

export default CreateCustomer