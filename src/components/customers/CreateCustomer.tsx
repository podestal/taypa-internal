import useCreateCustomer from "../../hooks/api/customer/useCreateCustomer";
import CustomerForm from "./CustomerForm"

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
    isCustomerInfoComplete: () => boolean
}

const CreateCustomer = ({ 
    customerInfo, 
    setCustomerInfo, 
    handleNextStep, 
    isCustomerInfoComplete 
}: Props) => {
    const createCustomer = useCreateCustomer()
  return (
    <CustomerForm 
        customerInfo={customerInfo}
        setCustomerInfo={setCustomerInfo}
        createCustomer={createCustomer}
        handleNextStep={handleNextStep}
        isCustomerInfoComplete={isCustomerInfoComplete}
    />
  )
}

export default CreateCustomer