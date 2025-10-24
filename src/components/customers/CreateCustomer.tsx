import CustomerForm from "./CustomerForm"

interface Props {
    customerInfo: {
        firstName: string;
        lastName: string;
        phone: string;
        address: string;
        addressReference: string;
    }
    setCustomerInfo: (customerInfo: {
        firstName: string;
        lastName: string;
        phone: string;
        address: string;
        addressReference: string;
    }) => void
}

const CreateCustomer = ({ customerInfo, setCustomerInfo }: Props) => {
  return (
    <CustomerForm 
        customerInfo={customerInfo}
        setCustomerInfo={setCustomerInfo}
    />
  )
}

export default CreateCustomer